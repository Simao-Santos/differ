const database = require('../database');
const url = require('url');

// Get Captures
exports.get_captures = function(req, res, next) {
    let username = 'default';

    if(req.body.username)
        username = req.body.username;

    const queryObject = url.parse(req.url, true).query;

    // Should we check username?
    if(queryObject.page_id) {
        const query = {
            text: 'SELECT id, text_location, image_location, date FROM capture WHERE page_id=$1 AND deleted=$2',
            values: [queryObject.page_id, false]
        };
        
        let response = 'Error';
        
        database.query(query, (err, result) => {      
            if(!err)
            response = result.rows;
        
            res.send(response);
        });
    }
    else {
        res.send('Error: no specified page ID');
    }
}
