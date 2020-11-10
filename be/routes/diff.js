var express = require('express');
var router = express.Router();
const diff = require('../lib/diff.js');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { sameMsg, emptyMsg, baseText, newText, editorConfig } = require('../lib/constants.js');

const leftContent = "abcd";
const rightContent = "abcde";
var rawFileaux;

function readTextFile(file) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    rawFileaux = rawFile.responseText;
  }
  rawFileaux = rawFile.responseText;
  //rawFile.send(null);
  return rawFileaux;
}


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

function readSingleFile() {
  var file = 'zerozero.pt_old.txt';
  var reader = new FileReader();
  reader.readAsText(file);
  rawFileaux = reader.result();
}

router.get('/', function (req, res, next) {
  //função vai buscar o conteudo de todos os urls
  //diffcheker para cada "url" e dar append ao json
  //send json inteiro

  var final;
  var values;
  var old;
  var actual;

/*
  readTextFile('zerozero.pt_old.txt');

  values = diffChecker(rawFileaux, rightContent);
  //final.push(values);
   res.send(rawFileaux);
*/
  /* 
   values = diffChecker(old2, actual2);
   final.push(values); */

  //res.send(readTextFile("~/FEUP/LDSO/project/t1g1/be/pagecodes/zerozero.pt/zerozero.pt_old.txt"));
  /*
  const fs = require('fs')

  fs.readFile('zerozero.pt_old.txt  ', (err, data) => {
    if (err) throw err;

    // Converting Raw Buffer to text 
    // data using tostring function. 
    old=data.toString();
  })

  values = diffChecker(old,actual);
  final.push(values);
  res.send(values);
*/
/*
readSingleFile();
res.send(rawFileaux);
*/
/*
var fs = require('fs');
var textByLine = fs.readFileSync('zerozero.pt_old.txt').toString().split("\n");
res.send(textByLine);
*/
});

module.exports = router;