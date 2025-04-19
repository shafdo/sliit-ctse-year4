import { Joi } from 'celebrate';

export const userCreateSchema = Joi.object({
  fname: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('admin', 'instructor', 'student').required(),
});

export const userUpdateSchema = Joi.object({
  fname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const authSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('admin', 'instructor', 'student').required(),
});
