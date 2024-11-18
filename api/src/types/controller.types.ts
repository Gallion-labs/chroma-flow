import { Request, Response } from 'express';

export interface RouteHandler {
  (req: Request, res: Response): Promise<void | Response> | void | Response;
}