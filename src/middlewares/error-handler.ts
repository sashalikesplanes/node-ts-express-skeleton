import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';

export const handleErrors = async (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).send({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};
