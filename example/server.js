
// example/server.js - Example HTTP server application
module.exports = (function() {

  var http = require('http')
    , express = require('express')
    , handlers = require('./handlers')
    , router = require('../index') && require('./server.routes');

  var app = express();
  router.handlers(handlers);
  router.express(app);

  var server = http.createServer(app);
  server.listen(process.env.PORT || 8888);

  return server;

})();

