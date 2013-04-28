
/* Main route-table syntax grammar
 * - Compiled to grammar.js
 * - Used in route-table.js
 */

{ var null_ = { }; }

// ________________________________________________________
//                                           LINE STRUCTURE
start
= lines:line+ {
  var i = 0, count = lines.length, result = [];
  for (;i < count; i++)
    if (lines[i] !== null_)
      result.push(lines[i]);

  return result;
}

line
= newline { return null_; }
/ comment newline { return null_; }
/ space+ comment newline { return null_; }
/ method:method space+ path:path space+ mapping:mapping (space+ comment)? newline {
  return {
    method: method,
    path: path,
    mapping: mapping
  };
}

// ________________________________________________________
//                                                    PARTS
space = ' '
newline = '\r\n' / '\r' / '\n'
comment = '#' [^\r\n]*

method = method:('GET'i / 'POST'i / 'PUT'i / 'DEL'i 'ETE'i?) {
  if (method instanceof Array) method = method.join('')
  if (method === 'DEL') method = 'DELETE'
  return method;
}

path = path:('/' [^\?\r\n ]*) query:('?' [^?\r\n ]*)? {
  var line = path[0] + path[1].join('');
  if (query) line += query[0] + query[1].join('');

  return line;
}

mapping = controller:[^\.\r\n ]+ [.] action:[^ \r\n]+ {
  return { controller: controller.join(''), action: action.join('') };
}

