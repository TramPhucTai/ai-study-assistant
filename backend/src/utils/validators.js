import { body, validationResult } from "express-validator";

export const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
    }

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }
    
    return res.status(422).json({
      errors: errors.array()
    });
  };
};

export const loginValidator = [

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Vui lòng nhập email")
    .bail()
    .isEmail()
    .withMessage("Email không đúng định dạng"),

  body("password")
    .notEmpty()
    .withMessage("Vui lòng nhập mật khẩu")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),

];

export const signupValidator = [

  body('name')
    .notEmpty()
    .withMessage('Vui lòng nhập họ và tên'),

  ...loginValidator,

];

export const chatCompletionValidator = [

  body('message')
    .notEmpty()
    .withMessage('Vui lòng nhập nội dung tin nhắn'),

];
