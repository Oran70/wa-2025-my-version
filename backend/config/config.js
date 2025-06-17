require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const dialectOptionsSSL =
  process.env.PG_SSL === 'true'
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    : {};

module.exports = {
  development: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_NAME,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: dialectOptionsSSL,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_NAME_TEST || 'eduplandb_test',
    host: process.env.PG_HOST,
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: dialectOptionsSSL,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  },
  production: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_NAME,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT || 5432,
    use_env_variable: process.env.DATABASE_URL ? 'DATABASE_URL' : undefined,
    dialect: 'postgres',
    logging: false,
    dialectOptions: dialectOptionsSSL,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    },
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
