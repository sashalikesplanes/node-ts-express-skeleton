import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from './api-error';

export default class ErrorHandler {
  static handle = () => {
    return async (err: ApiError, req: Request, res: Response, next: NextFunction) => {
      const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      return res.status(statusCode).send({
        success: false,
        message: err.message,
        stack: err.stack,
      });
    };
  };
}
