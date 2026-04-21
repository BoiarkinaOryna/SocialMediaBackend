export function success<T>(message: string, data: T) {
	return { message, status: "success", data };
}
