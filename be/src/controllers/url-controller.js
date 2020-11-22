const database = require('../database');
const actions_controller = require('../controllers/actions-controller');

// Get URLs added by a specific user from the database
exports.get_urls = function(req, res, next) {
  let username = 'default';

  if(req.body.username)
    username = req.body.username;

  let query;

  if(req.params.id) {
    query = {
      text: 'SELECT id, url FROM page WHERE username=$1 AND deleted=$2 AND id=$3',
      values: [username, false, req.params.id]
    };
  }
  else {
    query = {
      text: 'SELECT id, url FROM page WHERE username=$1 AND deleted=$2',
      values: [username, false]
    };
  }

  database.query(query, (err, result) => { 
    if(err) {
      const json = {
        type: 'error',
        msg: 'Couldn\'t access database'
      }
  
      res.send(json);
    }
    else {
      const json = {
        type: 'get_urls',
        urls: result.rows,
        msg: 'Operation successful'
      }
  
      res.send(json);
    }
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
      text: 'INSERT INTO page (username, url) VALUES ($1, $2) RETURNING id',
      values: [username, req.body.url]
    };

    console.log('URL: ' + req.body.url)
  
    database.query(queryInsert, (err, resultInsert) => {
      if(err) {
        const json = {
          type: "error",
          msg: 'Couldn\'t add URL'
        }

        res.send(json);
      }
      else {
        const querySelect = {
          text: 'SELECT id, url FROM page WHERE username=$1 AND deleted=$2',
          values: [username, false]
        };

        database.query(querySelect, (err, resultSelect) => {
          if(err) {
            console.log('URL added, but couldn\'t retrieve URL list');

            const json = {
              type: "post_url",
              msg: 'Operation successful, but couldn\'t retrieve URL list'
            }
        
            res.send(json);
          }
          else {
            const json = {
              type: "post_url",
              urls: resultSelect.rows,
              msg: 'Operation successful'
            }
        
            res.send(json);
          }
        });

        console.log('URL saved with ID ' + resultInsert.rows[0].id);
        actions_controller.captureUrlSync(resultInsert.rows[0].id, null);
      }
    });
  }
  else {
    const json = {
      type: "error",
      msg: 'No specified URL'
    }

    res.send(json);
  }
}

// Deletes urls from the database
exports.delete_url = function(req, res, next) {
  let username = 'default';

  if(req.body.username)
    username = req.body.username;

  console.log('Deleting url...');

  if(req.params.id) {
    const query = {
      text: 'UPDATE page SET deleted=$1 WHERE id=$2 AND deleted=$3 RETURNING id',
      values: [true, req.params.id, false]
    };

    database.query(query, (err, result) => {
      if(err || result.rowCount == 0) {
        console.log('Couldn\'t mark page with ID ' + req.params.id + ' as deleted');

        const json = {
          type: 'error',
          id: req.params.id,
          msg: 'Couldn\'t delete URL'
        };

        res.send(json);
      }
      else {
        console.log('Page with ID ' + req.params.id + ' marked as deleted');
        
        const json = {
          type: 'delete_url',
          id: req.params.id,
          msg: 'Operation successful'
        };

        res.send(json);
      }
    });  
  }
  else {
    const json = {
      type: 'error',
      id: -1,
      msg: 'No specified URL id'
    };

    res.send(json);
  }
}