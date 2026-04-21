import { NextFunction, Request, Response } from "express";
import multer, { memoryStorage } from "multer";
import { BadRequestError } from "../errors";
import { join } from "node:path";
import { originalDir, thumbnailDir } from "../config/path";
import sharp from "sharp";

export const uploadMiddleware = multer({ storage: memoryStorage() });

export function processImageMiddleware(
	isRequired: boolean,
	size: number,
	quality: number = 50,
) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			const file = req.file;
			if (!file) {
				if (isRequired)
					next(new BadRequestError("File was not loaded"));
				else {
					next();
				}
				return;
			}

			const filename = Date.now() + ".jpeg";
			const originalFilePath = join(originalDir, filename);
			const thumbnailFilePath = join(thumbnailDir, filename);

			await sharp(file.buffer)
				.jpeg({ quality: 100 })
				.toFile(originalFilePath);

			await sharp(file.buffer)
				.resize({ width: size, height: size })
				.jpeg({
					quality,
				})
				.toFile(thumbnailFilePath);
			file.filename = filename;
			next();
		} catch (error) {
			next(error);
		}
	};
}
