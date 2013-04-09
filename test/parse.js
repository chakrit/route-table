
// test/parse.js - Test that the basic.routes file parses correctly.
var fs = require('fs')
  , grammar = require('../lib/grammar.js')
  , content = fs.readFileSync(__dirname + '/basic.routes', 'utf-8')
  , inspect = function(obj) { return JSON.stringify(obj, 0, 2); };

try {
  console.log(inspect(grammar.parse(content)));
} catch (e) {
  console.log(inspect(e));
}

