import { NextFunction, Request, Response } from "express";

export function logMiddleware(req: Request, res: Response, next: NextFunction) {
	const now = new Date().toISOString();
	console.log(`[${req.method}] ${req.host} ${req.path} ${now}`);
	next();
}
