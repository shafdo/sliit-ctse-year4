import express from 'express';
import { createUser, login } from '@/controllers/user.controller';
import { validateData } from '@/middleware/joiValidate';
import {
  authSchema,
  userCreateSchema,
  userUpdateSchema,
} from '@/validations/user';

const userRouter = express.Router();

// Route definitions
userRouter.get('/', (req, res) => {
  return res.json({
    status: 200,
    msg: 'user management api running.',
  });
});
userRouter.post('/', validateData(userCreateSchema), createUser);
userRouter.post('/login', validateData(authSchema), login);
// Route definitions end

export default userRouter;
