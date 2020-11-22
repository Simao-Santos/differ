const { Pool } = require('pg');

// TODO: remove credentials (use secrets)
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

module.exports = pool;
