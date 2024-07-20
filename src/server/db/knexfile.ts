import type { Knex } from "knex";
import { config as env } from "../env";

const { dbUser, dbPass, dbName, dbHost } = env;

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
