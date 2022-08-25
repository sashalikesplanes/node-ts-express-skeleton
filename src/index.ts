import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { ApiError } from './utils/api-error';
import { asyncWrapper } from './utils/async-wrapper';
import { NotFoundError } from './utils/not-found-error';
import { StatusCodes } from 'http-status-codes';
import { handleErrors } from './middlewares/error-handler';
import { CreateUserRequest } from './validation/create-user-request';
import RequestValidator from './validation/request-validator';
import { Logger } from './utils/logger';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Logger.getHttpLoggerInstance());
const logger = Logger.getInstance();

app.get('/', async (req, res) => {
  return res.send({
    message: 'I am working v3',
  });
});

// Example protected route with Error throwing
app.get(
  '/protected',
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    try {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'no auth');
    } catch (err) {
      next(err);
    }
  }),
);

// Example post request with validation
app.use('/create-user', RequestValidator.validate(CreateUserRequest), async (req, res) => {
  res.status(StatusCodes.OK).send({
    message: 'hello from create user',
  });
});
// Resource not found middleware
app.use('*', (req, res, next) => next(new NotFoundError(req.path)));

// General error handler
app.use(handleErrors);

const PORT = 3000;

try {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}

// Gracefully handle unexpectedly rejected promises
process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
  console.log(reason.name, reason.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  process.exit(1);
});

// Gracefully handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  process.exit(1);
});
