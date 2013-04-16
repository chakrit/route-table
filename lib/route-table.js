
module.exports = (function() {

  var fs = require('fs')
    , parse = require('./grammar.js').parse;

  function createRouter(filename) {
    var routes = parse(fs.readFileSync(filename, 'utf-8'))
      , handlers = null;

    routes.handlers = function(handlers_) { handlers = handlers_; };

    routes.express = function(app) {
      var count = routes.length, i = 0
        , method = null, route = null, mapping = null, group = null;

      if (!handlers) throw new Error('must register handlers() first.');

      for (; i < count; i++) {
        route = routes[i];
        mapping = route.mapping;
        if (!((group = handlers[mapping.group]) && (handler = group[mapping.action])))
            continue;

        method = app[route.method.toLowerCase()]
        if (handler instanceof Array) {
          method.apply(app, [route.url.pathname].concat(handler));
        } else {
          method.call(app, route.url.pathname, handler);
        }
      }
    };

    routes.route = function(req) {
      var count = routes.length, i = 0, route = null;

      if (typeof req === 'string') {
        for (; i < count; i++) {
          route = routes[i];
          if (route.url.path == req) return route;
        }

      } else {
        for (; i < count; i++) {
          route = routes[i]
          if (route.url.href === req.url && route.method === req.method) return route;
        }
      }

      return null;
    };

    return routes;
  }

  require.extensions['.routes'] = function(module, filename) {
    module.exports = createRouter(filename);
  };

  return createRouter;

})();

