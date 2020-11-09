const database = require('../database');

// Get Comparisons
exports.get_comparisons = function(req, res, next) {
    let username = 'default';

    if(req.body.username)
        username = req.body.username;

    // Should we check username?
    if(req.body.page_id) {
        const query = {
            text: 'SELECT * FROM comparison WHERE (capture_1_id IN (SELECT id FROM capture WHERE page_id=$1 AND deleted=$2) OR capture_1_id IN (SELECT id FROM capture WHERE page_id=$1 AND deleted=$2)) AND deleted=$2 ORDER BY date DESC',
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
