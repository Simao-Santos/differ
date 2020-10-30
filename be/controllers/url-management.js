const database = require('../database');

// Get URLs added by a specific user from the database
exports.get_urls = function(req, res, next) {
  let username = 'default';

  if(req.body.username)
    username = req.body.username;

  const query = {
    text: 'SELECT \"ID\", \"URL\" FROM public.\"Page\" WHERE \"Username\"=$1',
    values: [username]
  };

  let response = 'Error';

  database.query(query, (err, result) => {      
    if(!err)
      response = result.rows;

    res.send(response);
  });
}

// Add a new URL to the database
exports.add_url = function(req, res, next) {
  let username = 'default';

  if(req.body.username)
    username = req.body.username;

  console.log(req.body);
  console.log(req.body.url);

  if(req.body.url) {
    const queryInsert = {
      text: 'INSERT INTO public.\"Page\" (\"Username\", \"URL\") VALUES ($1, $2)',
      values: [username, req.body.url]
    };
  
    database.query(queryInsert, (err, resultInsert) => {        
      if(err)
        res.send('Error adding URL');
      else {
        const querySelect = {
          text: 'SELECT \"ID\", \"URL\" FROM public.\"Page\" WHERE \"Username\"=$1',
          values: [username]
        };

        database.query(querySelect, (err, resultSelect) => {
          if(err)
            res.send('URL added, but couldn\'t retrieve URL list');
          else
            res.send(resultSelect.rows);
        });
      }
    });
  }
  else {
    res.send('Error: no specified URL');
  }
}