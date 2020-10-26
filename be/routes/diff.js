var express = require('express');
var router = express.Router();
const diff = require('../lib/diff.js');
const { sameMsg, emptyMsg, baseText, newText, editorConfig } = require('../lib/constants.js');

const leftContent = "abcd";
const rightContent = "abcde";


function diffChecker() {
  const lc = diff.lib.stringAsLines(leftContent);
  const rc = diff.lib.stringAsLines(rightContent);

  diff.lib.SequenceMatcher(lc, rc);

  const opcodes = diff.lib.get_opcodes();
  baseTextName= baseText;
  newTextName= newText;
  contextSize=null;

  return[lc,rc,opcodes,baseTextName,newTextName];
}


router.get('/', function (req, res, next) {
  //função vai buscar o conteudo de todos os urls
  //diffcheker para cada "url" e dar append ao json
  //send json inteiro
  var values = diffChecker();
  res.send(values);
});

module.exports = router;