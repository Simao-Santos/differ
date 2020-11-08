const database = require('../database');
const request = require('../html_request');
const Pageres = require('pageres');
const fs = require('fs');

// Get URLs added by a specific user from the database
exports.get_urls = function(req, res, next) {
  let username = 'default';

  if(req.body.username)
    username = req.body.username;

  const query = {
    text: 'SELECT id, url FROM page WHERE username=$1 AND deleted=$2',
    values: [username, false]
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
      text: 'INSERT INTO page (username, url) VALUES ($1, $2) RETURNING id',
      values: [username, req.body.url]
    };

    console.log('URL: ' + req.body.url)
  
    database.query(queryInsert, (err, resultInsert) => {
      if(err)
        res.send('Error adding URL');
      else {
        const querySelect = {
          text: 'SELECT id, url FROM page WHERE username=$1 AND deleted=$2',
          values: [username, false]
        };

        database.query(querySelect, (err, resultSelect) => {
          if(err) {
            console.log('URL added, but couldn\'t retrieve URL list');
            res.send('URL added, but couldn\'t retrieve URL list');
          }
          else
            res.send(resultSelect.rows);
        });

        console.log('URL saved with ID ' + resultInsert.rows[0].id);
        captureUrl(resultInsert.rows[0].id);
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
    text: 'SELECT url FROM page WHERE id=$1 AND deleted=$2',
    values: [id, false]
  };

  database.query(querySelect, (err, resultSelect) => {
    if(err || resultSelect.rowCount == 0)
      console.log('Couldn\'t get URL to capture');
    else {
      captureUrlAsync(id, resultSelect.rows[0].url)
    }
  });
}

// Asynchronous function that will capture the url content and screenshot
async function captureUrlAsync(id, url) {
  const folder = './shots';

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

  const filename = 'url_' + id + '_' + date;

  // Get content from url
  let body = await request.getRequest(url);

  // The following code will identify every link that starts with a single "/", which refers to the root of the website,
  // And add the url before it (so it can actually get the content, which won't be saved locally)
  const regex = /"\/(?!\/)/gi;
  body = body.replace(regex, '\"' + url + ((url.endsWith('/')) ? '' : '/'));

  const contentPath = folder + ((folder.endsWith('/')) ? '' : '/') + filename + ".html";

  // Saves the url content to file
  if(fs.existsSync(contentPath)) {
    console.log('Error: can\'t save url content (file with this name already exists)');
  }
  else {
    console.log('Saving page content for ' + url + '...');

    try {
      fs.writeFileSync(contentPath, body);
      console.log('Page content saved!');

      const screenshotPath = await saveUrlScreenshot(contentPath, filename, folder);

      const query = {
        text: 'INSERT INTO capture (page_id, image_location, text_location, date) VALUES ($1, $2, $3, $4) RETURNING id',
        values: [id, screenshotPath, contentPath, today]
      };
    
      database.query(query, (err, resultInsert) => {
        if(err || resultInsert.rowCount == 0)
          console.log('Couldn\'t save capture');
        else
          console.log('Capture saved with ID ' + resultInsert.rows[0].id)
      });
    }
    catch (err) {
      console.log('Error saving page content: ' + err)
    }
  }
}

// Function that will screenshot the url page
async function saveUrlScreenshot(codeFilePath, filename, saveFolder) {
  console.log('Generating page screenshot...');

  // A rare bug can occur when launching Chrome. From what I understand it's related to the GNU C library, don't know what we can do about it.
  // It is very rare though. As of now, it has only happened once.
  // https://github.com/puppeteer/puppeteer/issues/2207
  //
  // There are still problems with some characters and some images that aren't displayed correctly
  await new Pageres({delay: 2})
    .src(codeFilePath, ['1920x1080'], {filename: filename + '.png'})
    .dest(saveFolder)
    .run();
    
  console.log('Finished generating screenshot!');

  return saveFolder + ((saveFolder.endsWith('/')) ? '' : '/') + filename + '.png';
}