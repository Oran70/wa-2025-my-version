const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    development: {
        username: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: 'eduplandb_dev',
        host: process.env.PG_HOST,
        port: process.env.PG_PORT || 5432,
        dialect: 'postgres',
        logging: console.log,
        ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
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
});

// Test database connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool;
