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
  const myUrlIds = [];

  console.log('getting urls from db')

  const requestOptions = {
    method: 'GET'
  }

  
  var jsoncontent=[];
  await fetch('http://localhost:8000/urls/', requestOptions)
  .then(res => res.json())
  .then(json => jsoncontent.push(json.urls));
    //final.push(jsoncontent);
    return jsoncontent;    
}

function getOne(id){
  //TODO get page by id
  var oldpath = './public/shots/url_35_2020_11_22_01_45_53_972.html';
  var newpath = './public/shots/url_35_2020_11_22_01_52_05_736.html';

  var oldpage = fs.readFileSync(oldpath).toString();
  var actualpage = fs.readFileSync(newpath).toString();

  //var values = diffChecker(oldpage,actualpage);
  return values;
}

function getValues(){
  //TODO percorrer os diferentes ids presentes na base de dados
  var jsoncontent = getListOfUrls();


  //var values = getOne(id);
  //final.push((values));
}

router.get('/', function (req, res, next) {
  //função vai buscar o conteudo de todos os urls
  //diffcheker para cada "url" e dar append ao json
  //send json inteiro

  getValues();

  res.send(final);
});

module.exports = router;