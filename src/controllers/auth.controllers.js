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
//register user
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
//login user
const login = asynchandler(async(req,res)=>{
  const {email,password,username} = req.body;
  if(!email){
    throw new ApiError(400,"email is required")
  }
  const user = await User.findOne({email});
  if(!user){
    throw new ApiError(400,"user does not exist with this email")
  }
  //check password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if(!isPasswordValid){
    throw new ApiError(400,"Password does not match");
  }
  //generate token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );
  //sending cookies
  const options ={
    httpOnly: true,
    secure: true
  }
  return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{
      user: loggedInUser,
      accessToken,
      refreshToken
    },
    "User logged in successfully"
  ));

});

export{registerUser,login}