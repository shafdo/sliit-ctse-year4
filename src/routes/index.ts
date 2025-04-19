import express from 'express';
import userRouter from '@/routes/user.route';

const routerv1 = express.Router();

// Route definitions
routerv1.use('/user', userRouter);
// Route definitions end

routerv1.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Endpoint not found. Please check the documentation.',
  });
});

export default routerv1;
