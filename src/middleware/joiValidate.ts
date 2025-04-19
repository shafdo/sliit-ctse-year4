import { NextFunction, Request, Response } from 'express';

export const validateData = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details });
    }
    next(); // If validation passes, move to the next middleware
  };
};
