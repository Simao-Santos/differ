var express = require('express');
const fs = require('fs')
var router = express.Router();
const diff = require('../lib/diff.js');
const { sameMsg, emptyMsg, baseText, newText, editorConfig } = require('../lib/constants.js');
const fetch = require("node-fetch");

var final=[];

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
    //.then(res => res.json())
    .then(json => jsoncontent = json);

  var data = await response.json();
  //final.push(jsoncontent.urls);
  console.log('DATA::::'+ data);
  return JSON.stringify(data);
}

function getIds(jsoncontent) {
  const myUrlIds = [];
  for (let i = 0; i < jsoncontent.length; i += 1) {
    myUrlIds[i] = jsoncontent[i].id;
  }
  return myUrlIds;
}

function getOne(id){
  //TODO get page by id
  var oldpath = './public/shots/url_35_2020_11_22_01_45_53_972.html';
  var newpath = './public/shots/url_35_2020_11_22_01_52_05_736.html';

  var oldpage = fs.readFileSync(oldpath).toString();
  var actualpage = fs.readFileSync(newpath).toString();

  var values = diffChecker(oldpage,actualpage);
  return values;
}

router.get('/', function (req, res, next) {
  var jsoncontent =getListOfUrls();
  var ids = getIds(jsoncontent);

  for(id in ids){
    var values = getOne(id)
    final.push(values);
  }
  res.send(final);
});

module.exports = router;