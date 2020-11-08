const database = require('../database');
const request = require('../html_request');

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

  console.log('Adding url...');

  if(req.body.url) {
    const queryInsert = {
      text: 'INSERT INTO public.\"Page\" (\"Username\", \"URL\") VALUES ($1, $2) RETURNING \"ID\"',
      values: [username, req.body.url]
    };

    console.log('URL: ' + req.body.url)
  
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

        captureUrl(resultInsert.rows[0].ID);
      }
    });
  }
  else {
    res.send('Error: no specified URL');
  }
}

// Synchronous function that will retrieve the URL and call the asynchronous function
function captureUrl(id) {
  const querySelect = {
    text: 'SELECT \"URL\" FROM public.\"Page\" WHERE \"ID\"=$1',
    values: [id]
  };

  database.query(querySelect, (err, resultSelect) => {
    if(err || resultSelect.rowCount == 0)
      res.send('Couldn\'t get URL to capture');
    else {
      captureUrlAsync(id, resultSelect.rows[0].URL)
    }
  });
}

// Asynchronous function that will capture the url content and screenshot
async function captureUrlAsync(id, url) {
  // Build filename for files
  const today = new Date();
  const year = String(today.getFullYear());
  const mon = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hour = String(today.getHours()).padStart(2, '0');
  const min = String(today.getMinutes()).padStart(2, '0');
  const sec = String(today.getSeconds()).padStart(2, '0');
  const millisec = String(today.getMilliseconds()).padStart(3, '0');

  const date =
    year + "_" + mon + "_" + day + "_" +
    hour + "_" + min + "_" + sec + "_" + millisec;

  // Get content from url
  const body = await request.getRequest(url);

  // The following code will identify every link that starts with a single "/", which refers to the root of the website,
  // And add the url before it (so it can actually get the content, which won't be saved locally)
  const regex = /"\/(?!\/)/gi;
  body = body.replace(regex, '\"' + url + ((url.endsWith('/')) ? '' : '/'));
}