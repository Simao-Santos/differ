const { Pool } = require('pg');

// TODO: remove credentials (use secrets)
const pool = new Pool({
    user: 'postgres',
    host: 'postgres',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
  })

const querySelect = {
  text: 'SELECT * FROM public.\"User\" WHERE \"Username\"=$1',
  values: ['default']
}

const queryInsert = {
  text: 'INSERT INTO public.\"User\" (\"Username\", \"Password\") VALUES ($1, $2)',
  values: ['default', 'default']
}

// The database should always have a 'default' user
// If it doesn't yet exist, create it
pool.query(querySelect, (err, res) => {
    if(res.rowCount == 0 || res.rows[0].count == '0')
    {
      console.log('No default user in database, adding...');
      pool.query(queryInsert, (err, res) => {
        if(err)
          console.log('Error adding default user')
        else
          console.log('Default user added')
      });
    }
  });

module.exports = pool