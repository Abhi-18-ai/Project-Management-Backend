import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asynchandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";
//working of tokens
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // saving tokens
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error in generating and saving token", error);
  }
};

const registerUser = asynchandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //check if user exist
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(
      409,
      "User is already exist with this email or username",
    );
  }
  //new user register
  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });
  const { unHashedToken, HashedToken, TokenExpiry } =
    user.generateTemporaryToken();

  //email Verification
  user.emailVerificationToken = HashedToken;
  user.emailVerificationExpiry = TokenExpiry;

  await user.save({ validateBeforeSave: false });
  await sendEmail({
    email: user?.email,
    subject: "please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verifiy-email/${unHashedToken}`,
    ),
  });

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );
  if (!createUser) {
    throw new ApiError(500, "something went wrong wile registering a user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createUser },
        "User registerd successfully and verification email sent on your mail",
      ),
    );
});


export{registerUser}