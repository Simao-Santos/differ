const database = require('../database');

// Get Captures
exports.get_captures = function(req, res, next) {
    let username = 'default';

    if(req.body.username)
        username = req.body.username;

    let query;

    // Should we check username?
    if(req.params.id) {
        query = {
            text: 'SELECT id, text_location, image_location, date FROM capture WHERE id=$1 AND deleted=$2',
            values: [req.params.id, false]
        };
    }
    else {
        query = {
            text: 'SELECT id, text_location, image_location, date FROM capture WHERE deleted=$1',
            values: [false]
        };
    }
        
    database.query(query, (err, result) => {      
        if(err) {
            const json = {
                type: 'error',
                msg: 'Couldn\'t access database'
            };
        
            res.send(json);
        }
        else {
            const json = {
                type: 'get_captures',
                captures: result.rows,
                msg: 'Operation successful'
            };
        
            res.send(json);
        }
    });
}

exports.get_captures_by_page_id = function(req, res, next) {
    let username = 'default';

    if(req.body.username)
        username = req.body.username;

    let query;

    // Should we check username?
    if(req.params.id) {
        query = {
            text: 'SELECT id, text_location, image_location, date FROM capture WHERE page_id=$1 AND deleted=$2',
            values: [req.params.id, false]
        };

        database.query(query, (err, result) => {      
            if(err) {
                const json = {
                    type: 'error',
                    msg: 'Couldn\'t access database'
                };
            
                res.send(json);
            }
            else {
                const json = {
                    type: 'get_captures_by_page_id',
                    captures: result.rows,
                    msg: 'Operation successful'
                };
            
                res.send(json);
            }
        });
    }
    else {
        const json = {
            type: 'error',
            msg: 'No specified page ID'
        };
    
        res.send(json);
    }
}

exports.delete_captures = function(req, res, next) {
    let username = 'default';

    if(req.body.username)
        username = req.body.username;

    console.log('Deleting capture...');

    if(req.params.id) {
        const query = {
            text: 'UPDATE capture SET deleted=$1 WHERE id=$2 AND deleted=$3 RETURNING id',
            values: [true, req.params.id, false]
        };

        database.query(query, (err, result) => {
            if(err || result.rowCount == 0) {
                console.log('Couldn\'t mark capture with ID ' + req.params.id + ' as deleted');

                const json = {
                    type: 'error',
                    id: req.params.id,
                    msg: 'Couldn\'t delete capture'
                };

                res.send(json);
            }
            else {
                console.log('Page with capture ' + req.params.id + ' marked as deleted');
                
                const json = {
                    type: 'delete_capture',
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
            msg: 'No specified capture id'
        };

        res.send(json);
    }
}