import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { ApiError } from './utils/api-error';
import { asyncWrapper } from './utils/async-wrapper';
import { NotFoundError } from './utils/not-found-error';
import { StatusCodes } from 'http-status-codes';
import ErrorHandler from './utils/error-handler';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post('', async (req, res) => {
  console.log(req.body);
  return res.send({
    message: 'Hello from post',
  });
});

// Resource not found middleware
app.use('*', (req, res, next) => next(new NotFoundError(req.path)));

// General error handler
app.use(ErrorHandler.handle());

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
  throw reason;
})

// Gracefully handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  process.exit(1);
})

