var express = require('express');
var router = express.Router();
const diff = require('../lib/diff.js');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { sameMsg, emptyMsg, baseText, newText, editorConfig } = require('../lib/constants.js');


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

router.get('/', function (req, res, next) {
  //função vai buscar o conteudo de todos os urls
  //diffcheker para cada "url" e dar append ao json
  //send json inteiro

  var final=[];
  var values;
  var old;
  var actual="abcde";

  const fs = require('fs')
  old = fs.readFileSync('./routes/zerozero.pt_old.txt').toString();
  
  values = diffChecker(old,actual);
  final.push((values));
  res.send(final);

});

module.exports = router;