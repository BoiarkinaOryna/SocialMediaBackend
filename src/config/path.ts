import { join } from "node:path";

export const uploadDir = join(__dirname, "../", "../", "./uploads");
export const thumbnailDir = join(uploadDir, "./thumbnail");
export const originalDir = join(uploadDir, "./original");
