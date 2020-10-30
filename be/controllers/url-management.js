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
