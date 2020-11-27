var express = require('express');
const fs = require('fs')
//var router = express.Router();
const diff = require('../lib/diff.js');
const { sameMsg, emptyMsg, baseText, newText, editorConfig } = require('../lib/constants.js');
const fetch = require("node-fetch");
const { json } = require('express');

var router = require("express-promise-router")();



function diffChecker(old, actual) {
  const lc = diff.lib.stringAsLines(old);
  const rc = diff.lib.stringAsLines(actual);

  diff.lib.SequenceMatcher(lc, rc);

  const opcodes = diff.lib.get_opcodes();
  baseTextName = baseText;
  newTextName = newText;
  contextSize = null;

  return [lc, rc, opcodes, baseTextName, newTextName];
}
async function getListOfUrls() {
  var jsoncontent = new Object();

  console.log('getting urls from db')

  const requestOptions = {
    method: 'GET'
  }

  var response = await fetch('http://localhost:8000/urls/', requestOptions)
    .then(res => res.json())
    .then(json => jsoncontent = json);
  return JSON.stringify(jsoncontent.urls);
}

function getIds(jsoncontent) {
  const myUrlIds = [];
  var json_ids = JSON.parse(jsoncontent);
  for (let i = 0; i < json_ids.length; i += 1) {
    myUrlIds[i] = json_ids[i].id;
  }
  return myUrlIds;
}

async function getOne(id) {
  //TODO get page by id
  var jsoncontent ;
  const requestOptions = {
    method: 'GET'
  }
  await fetch(`http://localhost:8000/captures/byPageId/${id}`, requestOptions)
        .then((res) => res.text())
        .then(json => jsoncontent = json);
        //.then(json => final.push(json));

  var aux = JSON.parse(jsoncontent).captures.length;
  //final.push(JSON.parse(jsoncontent).captures[0].text_location);
//console.log(aux);

  //var oldpath = './src/public/shots/url_36_2020_11_26_02_15_15_441.html';
  //var newpath = './src/public/shots/url_36_2020_11_26_02_15_23_964.html';
  var oldpath = './src/public'+ JSON.stringify(JSON.parse(jsoncontent).captures[aux-1].text_location).substring(1).slice(0,-1);
  var newpath = './src/public'+ JSON.stringify(JSON.parse(jsoncontent).captures[aux-1].text_location).substring(1).slice(0,-1);

  var oldpage = fs.readFileSync(oldpath).toString();
  var actualpage = fs.readFileSync(newpath).toString();

  var values = diffChecker(oldpage, actualpage);
  return values;
}

router.get('/', async function (req, res, next) {
  var final = [];

  var jsoncontent = await getListOfUrls();
  var ids = getIds(jsoncontent);
  //final.push(ids);


  for (let i = 0; i < ids.length; i += 1) {
    console.log('ID----' + ids[i]);
    var values = await getOne(ids[i])
    final.push(values);
  }
  res.send(final);
});

module.exports = router;