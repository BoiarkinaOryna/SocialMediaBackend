import { cleanEnv, str, num } from "envalid";
import * as dotenv from "dotenv";

dotenv.config();

export const env = cleanEnv(process.env, {
	DATABASE_URL: str(),
	SECRET_KEY: str(),
	HOST: str({ default: "localhost" }),
	PORT: num(),
	EMAIL: str(),
	EMAIL_PASSWORD: str(),
	USER_USERNAME: str(),
	PASSWORD: str(),
	DB_ADDRESS: str(),
	DB_PORT: num()
});