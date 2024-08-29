import type { Knex } from "knex";
import { config as env } from "../env";

type Environment = typeof process.env.NODE_ENV | "staging";

type Config = {
  [key in Environment]?: Knex.Config;
};

const { dbUser, dbPass, dbName, dbHost, dbPort } = env;
const connection = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/postgres`;
const environment: Environment = process.env.NODE_ENV || "development";

const allConfigs: Config = {
  /*
   development: {
     client: "postgresql",
     connection: {
       host: dbHost,
       port: dbPort,
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
  */
  development: {
    client: "postgresql",
    connection,
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

  staging: {
    client: "postgresql",
    connection,
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

  production: {
    client: "postgresql",
    connection,
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
};

// export const config = allConfigs[environment];
module.exports = allConfigs[environment];
