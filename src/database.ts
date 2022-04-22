import { Sequelize, SequelizeOptions } from "sequelize-typescript";
// import { Op } from 'sequelize';
import { ConnectionOptions } from "tls";

const database = new Sequelize(<SequelizeOptions>{
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  dialect: "postgres",
  dialectOptions: { ssl: determineTlsMode() },
  // operatorsAliases: Op as any,
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  pool: {
    min: 0,
    max: 50,
    idle: 10000,
    acquire: 120000,
    evict: 10000,
    handleDisconnects: true,
  },
  omitNull: true,
  logging: false,
});

/**
 * Evaluate the ssl relevant environment variables PGSSLMODE, PGSSLROOTCERT
 * to enforce an encrypted connection or retain the default behavior
 */
function determineTlsMode(): boolean | ConnectionOptions {
  // see https://www.postgresql.org/docs/current/libpq-envars.html
  if (
    process.env.PGSSLMODE === "prefer" ||
    process.env.PGSSLMODE === "allow" ||
    process.env.PGSSLMODE === "require"
  ) {
    return {
      rejectUnauthorized: true,
      ca: process.env.PGSSLROOTCERT,
    };
  } else {
    // retain default 'pg' behavior
    return false;
  }
}

export default database;
