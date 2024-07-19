import * as dotenv from "dotenv";
import * as path from "path";

// Determine which .env file to load
const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.local";

// Load the environment variables from the appropriate file
dotenv.config({ path: path.resolve(__dirname, `../../${envFile}`) });

export const config = {
  dbHost: process.env.DB_HOST_URL,
  dbUser: process.env.DB_USERNAME,
  dbPass: process.env.DB_PASSWORD,
  dbName: process.env.DB,
};
