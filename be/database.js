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
  text: 'SELECT * FROM app_user WHERE username=$1',
  values: ['default']
}

const queryInsert = {
  text: 'INSERT INTO app_user (username, password) VALUES ($1, $2)',
  values: ['default', 'default']
}

// The database should always have a 'default' user
// If it doesn't yet exist, create it
pool.query(querySelect, (err, res) => {
  if(err)
    console.log('Error accessing database');
  else {
    if(res.rowCount == 0 || res.rows[0].count == '0')
    {
      console.log('No default user in database, adding...');
      pool.query(queryInsert, (err, res) => {
        if(err)
          console.log('Error adding default user');
        else
          console.log('Default user added');
      });
    }
  }
});

module.exports = pool