const database = require('../database');
const request = require('../html_request');
const Pageres = require('pageres');
const pixelmatch = require('pixelmatch');
const sharp = require('sharp');
const fs = require('fs');
const PNG = require('pngjs').PNG;

// Takes a capture of the specified urls
exports.capture_url = function(req, res, next) {
    let username = 'default';

    if(req.body.username)
        username = req.body.username;

    console.log('Capturing url...');

    if(req.params.id) {
        captureUrl(req.params.id, res);
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

// Synchronous function that will retrieve the URL and call the asynchronous function
function captureUrl(id, res) {
    const querySelect = {
        text: 'SELECT url FROM page WHERE id=$1 AND deleted=$2',
        values: [id, false]
    };

    database.query(querySelect, (err, resultSelect) => {
        if(err || resultSelect.rowCount == 0) {
        console.log('Couldn\'t get URL to capture');

        if(res) {
            const json = {
            type: 'error',
            id: id,
            msg: 'Couldn\'t get URL to capture'
            };
        
            res.send(json);
        }
        }
        else {
        captureUrlAsync(id, resultSelect.rows[0].url, false);

        if(res) {
            const json = {
            type: 'capture_url',
            id: id,
            msg: 'Capture started'
            };
        
            res.send(json);
        }
        }
    });
}

exports.captureUrlSync = captureUrl;

// Asynchronous function that will capture the url content and screenshot
async function captureUrlAsync(id, url, compareNext) {
    const folder = '/shots';

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
            fs.writeFileSync('./public' + contentPath, body);
            console.log('Page content saved!');

            const screenshotPath = await saveUrlScreenshot(contentPath, filename, folder);

            const query = {
                text: 'INSERT INTO capture (page_id, image_location, text_location, date) VALUES ($1, $2, $3, $4) RETURNING id',
                values: [id, screenshotPath, contentPath, today]
            };
            
            database.query(query, (err, resultInsert) => {
                if(err || resultInsert.rowCount == 0)
                console.log('Couldn\'t save capture');
                else {
                console.log('Capture saved with ID ' + resultInsert.rows[0].id)

                // If the captures are supposed to be compared immediatelly, call the function
                if(compareNext)
                    compareUrlAsync(id);
                }
            });
        }
        catch (err) {
            console.log('Error saving page content: ' + err)
        }
    }
}

// Compares the last capture of an URL with the current state
exports.compare_url = function(req, res, next) {
    let username = 'default';

    if(req.body.username)
        username = req.body.username;

    console.log('Starting url comparison...');

    if(req.params.id) {
        compareUrl(req.params.id, res);
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

// Synchronous function that will order capture of the current state, before comparing
function compareUrl(id, res) {
    const querySelect = {
        text: 'SELECT url FROM page WHERE id=$1 AND deleted=$2',
        values: [id, false]
    };

    database.query(querySelect, (err, resultSelect) => {
        if(err || resultSelect.rowCount == 0) {
            console.log('Couldn\'t get URL to compare');

            if(res) {
                const json = {
                type: 'error',
                id: id,
                msg: 'Couldn\'t get URL to compare'
                };
            
                res.send(json);
            }
        }
        else {
            captureUrlAsync(id, resultSelect.rows[0].url, true);

            const json = {
                type: 'compare_url',
                id: id,
                msg: 'Comparison started'
            };

            res.send(json);
        }
    });
}

// Asynchronous function that will order comparison of the 2 most recent captures
async function compareUrlAsync(id) {
    const folder = '/shots';

    const querySelect = {
        text: 'SELECT id, image_location, text_location FROM capture WHERE page_id=$1 AND deleted=$2 ORDER BY date DESC LIMIT 2',
        values: [id, false]
    };

    database.query(querySelect, (err, resultSelect) => {
        if(err || resultSelect.rowCount != 2)
            console.log('Couldn\'t get captures to compare');
        else {
            const old_capture_id = resultSelect.rows[0].id;
            const old_capture_img_loc = resultSelect.rows[0].image_location;
            const old_capture_text_loc = resultSelect.rows[0].text_location;

            const new_capture_id = resultSelect.rows[1].id;
            const new_capture_img_loc = resultSelect.rows[1].image_location;
            const new_capture_text_loc = resultSelect.rows[1].text_location;

            compareCaptures(old_capture_id, new_capture_id, old_capture_text_loc, new_capture_text_loc, old_capture_img_loc, new_capture_img_loc, folder);
        }
    });
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
        .src('./public' + codeFilePath, ['1920x1080'], {filename: filename})
        .dest('./public' + saveFolder)
        .run();
        
    console.log('Finished generating screenshot!');

    return saveFolder + ((saveFolder.endsWith('/')) ? '' : '/') + filename + '.png';
}

// Function that compares two captures
async function compareCaptures(id_1, id_2, text_location_1, text_location_2, image_location_1, image_location_2, saveFolder) {
    console.log('Starting comparison on captures ' + id_1 + ' and ' + id_2 + '...');

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

    const filename = 'comparison_' + id_1 + '_' + id_2 + '_' + date;
    const textFile = null;
    const imageFile = saveFolder + ((saveFolder.endsWith('/')) ? '' : '/') + filename + '.png';

    // TODO: compare text

    console.log('Comparing screenshots...');
            
    let img1 = PNG.sync.read(fs.readFileSync('./public' + image_location_1));
    let img2 = PNG.sync.read(fs.readFileSync('./public' + image_location_2));
    let img1Raw = fs.readFileSync('./public' + image_location_1);
    let img2Raw = fs.readFileSync('./public' + image_location_2);

    console.log('Capture 1 original size: ' + img1.width + 'x' + img1.height);
    console.log('Capture 2 original size: ' + img2.width + 'x' + img2.height);

    // This will check if the images are the same size (they have to be for the comparison to work)
    // They sometimes differ by only a few pixels for various reasons, so it adjusts
    // By decreasing the width and/or width of the larger image

    if(img1.width > img2.width) {
        img1Raw = await sharp(img1Raw).resize(img2.width, img1.height, {fit: 'cover', position: 'left top'}).toBuffer();
    }
    else if(img1.width < img2.width) {
        img2Raw = await sharp(img2Raw).resize(img1.width, img2.height, {fit: 'cover', position: 'left top'}).toBuffer();
    }

    if(img1.height > img2.height) {
        img1Raw = await sharp(img1Raw).resize(img1.width, img2.height, {fit: 'cover', position: 'left top'}).toBuffer();
    }
    else if(img1.height < img2.height) {
        img2Raw = await sharp(img2Raw).resize(img2.width, img1.height, {fit: 'cover', position: 'left top'}).toBuffer();
    }

    img1 = PNG.sync.read(img1Raw);
    img2 = PNG.sync.read(img2Raw);

    console.log('Capture 1 size after crop: ' + img1.width + 'x' + img1.height);
    console.log('Capture 2 size after crop: ' + img2.width + 'x' + img2.height);

    const {width, height} = img1;
    const diff = new PNG({width, height});

    const diff_pixels = 
        pixelmatch(img1.data, img2.data, diff.data, width, height,
        {threshold: 0.1, diffColorAlt: [0, 200, 0], alpha: 0.5});


    fs.writeFileSync('./public' + imageFile, PNG.sync.write(diff));

    console.log('Finished comparing screenshots!');
    console.log(diff_pixels + ' different pixels (' + (diff_pixels / (width*height) * 100) + '%)');

    const queryInsert = {
        text: 'INSERT INTO comparison (capture_1_id, capture_2_id, image_location, text_location, diff_pixels, total_pixels, date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        values: [id_1, id_2, imageFile, textFile, diff_pixels, width*height, today]
    }

    database.query(queryInsert, (err, resultInsert) => {
        if(err || resultInsert.rowCount == 0)
            console.log('Error adding comparison');
        else {
            console.log('Inserted comparison with ID ' + resultInsert.rows[0].id);
        }
    });
}