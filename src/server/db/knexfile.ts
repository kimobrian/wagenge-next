import type { Knex } from "knex";
import { config as env } from "../env";

type Environment = typeof process.env.NODE_ENV | "staging";

type Config = {
  [key in Environment]?: Knex.Config;
};

const { dbUser, dbPass, dbName, dbHost } = env;
const environment: Environment = process.env.NODE_ENV || "development";

export const allConfigs: Config = {
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

export const config = allConfigs[environment];
