const Pageres = require('pageres');
const pixelmatch = require('pixelmatch');
const sharp = require('sharp');
const fs = require('fs');
const { PNG } = require('pngjs');
const request = require('../html_request');
const database = require('../database');
const utils = require('../utils');
const diffLib = require('../lib/diff.js');
const { baseText, newText } = require('../lib/constants.js');



// Insert Gray Zone
exports.insert_gray_zone = function insert_gray_zone(req, res, next){
    console.log('Starting insertion of grey zones in database...')
  
    console.log(req.body);
  
    if (!(req.body.page_id && utils.isInteger(req.body.page_id) && req.body.gray_zone && typeof req.body.gray_zone ==="string" ))
    {
      console.log(utils.isInteger(req.body.page_id) );
      res.sendStatus(400);
      return ;
    }
  
    let query_text =`INSERT INTO gray_zone ( page_id, element_selector ) VALUES (${req.body.page_id} , '${ req.body.gray_zone}');`;  
  
    console.log("Query text : " + query_text);
    const query = {
      text: query_text
    };
  
    database.query(query, (err, result) => {
      if (err) {
        res.sendStatus(500);
      } else {
        console.log("Data has been successfully inserted into database")
        res.sendStatus(200);
      }
    });
  };
  
  // Get Gray Zone
  exports.get_gray_zones = function get_gray_zones(req, res, next) {
  
    if (!(req.params.id && utils.isInteger(req.params.id)))
    res.sendStatus(400);
  
    const query = {
      text: `SELECT * FROM gray_zone WHERE page_id=${req.params.id} AND deleted=$1`,
      values: [false],
    };
  
    database.query(query, (err, result) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.status(200).send(result.rows );
      }
    });
  };

  // Delete Gray Zone
  exports.delete_gray_zone = function delete_gray_zone(req, res, next) {
  
    if (!(req.params.id && utils.isInteger(req.params.id)))
    res.sendStatus(400);
  
    const query = {
      text: `UPDATE gray_zone SET deleted=$1 WHERE id=$2 AND deleted=$3 RETURNING id`,
      values: [true, req.params.id, false],
    };
  
    database.query(query, (err, result) => {
      if (err) {
        res.sendStatus(500);
      } else {
        console.log("Gray zone was successfully deleted")
        res.status(200).send(result.rows);
      }
    });
  };