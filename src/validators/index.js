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

export const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

export const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

export const userResetForgotPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

export const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ];
};

export const addMembertoProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRole)
      .withMessage("Role is invalid"),
  ];
};
