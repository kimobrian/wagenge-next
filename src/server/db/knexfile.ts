import type { Knex } from "knex";
// import * as dotenv from "dotenv";
import * as path from "path";
import { config as env } from "../env";

// const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.local";
// console.log("Path::", path.resolve(__dirname, `../../../${envFile}`));
// dotenv.config({ path: path.resolve(__dirname, `../../../${envFile}`) });

const { dbUser, dbPass, dbName, dbHost } = env;
console.log("🚀 ~ DB_USERNAME:", dbUser, dbName, dbPass, dbHost);
// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      host: dbHost,
      port: 5432,
      database: dbName,
      user: dbUser,
      password: dbPass,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "migrations",
      directory: "./migrations",
      extension: "ts",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      host: dbHost,
      database: dbName,
      user: dbUser,
      password: dbPass,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "migrations",
      directory: "./migrations",
      extension: "ts",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: dbHost,
      database: dbName,
      user: dbUser,
      password: dbPass,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "migrations",
      directory: "./migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};

module.exports = config;
