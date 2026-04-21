export class AppError extends Error {
	public statusCode: number;
	/**
	 * `constructor` - это специальный метод для создания и инициализации объекта,
	 * созданного с помощью класса. Он вызывается автоматически при использовании `new AppError(...)`.
	 *
	 * @param message - Текстовое описание ошибки.
	 * @param code - HTTP-статус код, который соответствует этой ошибке (например, 404, 400).
	 */
	constructor(message: string, statusCode: number) {
		// `super(message)` вызывает конструктор родительского класса (`Error`).
		super(message);
		this.statusCode = statusCode;
	}
}
export class BadRequestError extends AppError {
	constructor(message: string = "Bad request") {
		super(message, 400);
	}
}
export class NotFoundError extends AppError {
	constructor(resourceName: string) {
		super(`${resourceName} not found`, 404);
	}
}
export class ConflictError extends AppError {
	constructor(resourceName: string) {
		super(`${resourceName} already exists`, 409);
	}
}

export class InternalServerError extends AppError {
	constructor(message: string = "Server Internal Error") {
		super(message, 500);
	}
}
export class AuthenticationError extends AppError {
	constructor(message: string = "Unauthenticated Error") {
		super(message, 401);
	}
}

export class ValidationError extends AppError {
	constructor(message: string = "Validation Error") {
		super(message, 422);
	}
}
