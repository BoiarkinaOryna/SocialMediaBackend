import type { Request, Response, NextFunction } from "express";
import { ValidationError as YupValidationError, type AnySchema } from "yup";
import { ValidationError } from "../errors/app.errors";

export function validateMiddleware(schema: AnySchema) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            req.body = await schema.validate(req.body, {
                stripUnknown: true,
                abortEarly: false,
            });
            next();
        } catch (error) {
            if (error instanceof YupValidationError) {
                next(
                    new ValidationError(
                        error.inner.reduce(
                            (prev, current) => prev + ";" + current,
                            "",
                        ),
                    ),
                );
                return;
            }
            next(error);
        }
    };
}
