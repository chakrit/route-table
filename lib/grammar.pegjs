
/* Main route-table syntax grammar
 * - Compiled to grammar.js
 * - Used in route-table.js
 */

start = newlines? first:line rest:morelines newlines? {
  return [first].concat(rest);
}

morelines = lines:(newlines line)* {
  var result = [], line;
  for (var i = 0; i < lines.length; i++) {
    result.push(lines[i][1]);
  }
  return result;
}

line = method:methods spaces url:url spaces mapping:mapping {
  return {
    method: method,
    url: url,
    mapping: mapping
  };
}

spaces = (' ' / newlines)+
newlines = [\r\n]+

methods = method:('GET' / 'POST' / 'PUT' / 'DEL' 'ETE'?) {
  if (method instanceof Array) method = method.join('')
  if (method === 'DEL') method = 'DELETE'
  return method;
}

url = path:('/' [^\?\r\n ]*) query:('?' [^?\r\n ]*)? {
  var line = path[0] + path[1].join('');
  if (query) line += query[0] + query[1].join('');

  return require('url').parse(line, true);
}

mapping = group:[a-zA-Z0-9_-]+ [.] action:[a-zA-Z0-9_-]+ {
  return { group: group.join(''), action: action.join('') };
}

