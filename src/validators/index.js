import { body } from "express-validator";

export const userRegisterValidator = () => {
  return [
    //for email validation
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    //for username validation
    body("username")
      .notEmpty()
      .withMessage("username is required")
      .isLowercase()
      .withMessage("username must be in lowercase")
      .isLength()
      .withMessage("username must be at least 3 character"),
    //for password vaidation
    body("password").trim().notEmpty().withMessage("password is required"),
    //fullname optional
    body("fullname").optional().trim(),
  ];
};

export const userLoginValidator = () => {
  return [
    //for login validation
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("password is required"),
  ];
};
