
module.exports = (function() {

  var fs = require('fs')
    , parse = require('./grammar.js').parse;

  function createRouter(filename) {
    var routes = parse(fs.readFileSync(filename, 'utf-8'))
      , handlers = null;

    routes.handlers = function(handlers_) { handlers = handlers_; };

    routes.express = function(app) {
      var count = routes.length, i = 0
        , route = null, handler = null, group = null;

      if (!handlers) throw new Error('must register handlers() first.');

      for (; i < count; i++) {
        route = routes[i];
        if (!((group = handlers[route.group]) && (handler = group[route.action])))
            continue;

        app[route.method.toLowerCase()](route.route, handler);
      }
    };

    routes.route = function(req) {
      var count = routes.length, i = 0, route = null;

      if (typeof req === 'string') {
        for (; i < count; i++) {
          route = routes[i];
          if (route.route == req) return route;
        }

      } else {
        for (; i < count; i++) {
          route = routes[i]
          if (route.route === req.url && route.method === req.method) return route;
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

