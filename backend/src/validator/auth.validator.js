import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const registerValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Username must be between 2 and 100 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("contact")
    .optional()
    .isString()
    .withMessage("Contact must be a string"),
  body("googleId")
    .optional()
    .isString()
    .withMessage("googleId must be a string"),
  body("password")
    .if(body("googleId").not().exists())
    .notEmpty()
    .withMessage("Password is required when googleId is not provided")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validateRequest,
];

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validateRequest,
];

export const logoutValidator = [
  body()
    .custom((_, { req }) => {
      if (!req.cookies?.token && !req.headers.authorization) {
        throw new Error(
          "Logout requires an auth token cookie or Authorization header",
        );
      }
      return true;
    }),
  validateRequest,
];
