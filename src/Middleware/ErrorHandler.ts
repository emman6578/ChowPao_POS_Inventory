
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const errorHandler:ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: err.stack,
    });
};

export const successHandler = (data: any, res: Response) => {
    const successResponse = {
        success: true,
        data: data,
      };
      res.status(200).json(successResponse);
};
