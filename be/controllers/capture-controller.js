const database = require('../database');

// Get Captures added by a specific user from the database
exports.get_captures = function(req, res, next) {
    let username = 'default';

    if(req.body.username)
        username = req.body.username;

    // Should we check username?
    if(req.body.page_id) {
        const query = {
            text: 'SELECT id, text_location, image_location, date FROM capture WHERE page_id=$1 AND deleted=$2',
            values: [req.body.page_id, false]
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
