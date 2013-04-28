
// test/parse.js - Test that the basic.routes file parses correctly.
process.stdout.write(new Array(200).join('\n')); // clear

var fs = require('fs')
  , grammar = fs.readFileSync(__dirname + '/../lib/grammar.pegjs', 'utf-8')
  , peg = require('pegjs')
  , parser = peg.buildParser(grammar)
  , content = fs.readFileSync(__dirname + '/basic.routes', 'utf-8');

var log = console.log
  , result = []
  , i = 0
  , count = 0
  , line = null;


try {
  result = parser.parse(content);

  for (i = 0, count = result.length; i < count; i++) {
    line = result[i];

    with (line) { log(method, path, mapping.controller, mapping.action); }
  }

} catch (e) {
  if (e.name !== 'SyntaxError') {
    log(e.message);
    return process.exit(2);
  }

  log('line:      ' + e.line);
  log('found:     ' + e.found);
  log('expected:  ' + e.expected.join(' '));
  return process.exit(1);
}

