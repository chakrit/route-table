
module.exports = (function() {

  var fs = require('fs')
    , parse = require('./grammar.js').parse;

  function createRouter(filename) {
    var routes = parse(fs.readFileSync(filename, 'utf-8'))
      , handlers = null;

    routes.handlers = function(handlers_) { handlers = handlers_; };

    routes.express = function(app) {
      var count = routes.length, i = 0
        , method = null, route = null, mapping = null, controller = null;

      if (!handlers) throw new Error('must register handlers() first.');

      for (; i < count; i++) {
        route = routes[i];
        mapping = route.mapping;
        if (!(controller = handlers[mapping.controller])) continue;
        if (!(handler = controller[mapping.action])) continue;

        method = app[route.method.toLowerCase()]
        if (handler instanceof Array) {
          method.apply(app, [route.path].concat(handler));
        } else {
          method.call(app, route.path, handler);
        }
      }
    };

    routes.load = function(app, handlers) {
      routes.express(app);
      routes.handlers(handlers);
    };

    routes.route = function(req) {
      var count = routes.length, i = 0, route = null;

      if (typeof req === 'string') {
        for (; i < count; i++) {
          route = routes[i];
          if (route.path !== req) continue;

          return route;
        }

      } else {
        var tests = [];
        for (; i < count; i++) {
          route = routes[i]
          if (route.method !== req.method) continue;
          if (route.path !== req.url) continue;

          return route;
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

