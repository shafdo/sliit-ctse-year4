import { Response } from 'express';

type ResponseType = {
  res: Response;
  status?: number | undefined;
  message?: string | undefined;
  data?: object;
};

const response = ({
  res,
  status = 200,
  message,
  data = undefined,
}: ResponseType) => {
  const payload = {
    data,
    message,
  };
  return res.status(status).json(payload);
};

export default response;
