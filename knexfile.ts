import { Knex } from 'knex';
import * as dotenv from 'dotenv';

dotenv.config();
const { DATABASE_URL, DB_CLIENT } = process.env;

const config: Knex.Config = {
  client: DB_CLIENT,
  connection: DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
  },
  seeds: {
    directory: './migrations/seeds',
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  },
  debug: false,
  log: {
    debug: (query: string) => console.log(query),
  },
};

export default config;
