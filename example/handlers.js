
// example/routes.js - Route handlers
module.exports =
  { home:
    { index: function(req, resp) { resp.send(200, 'index!'); }
    , two: function(req, resp) { resp.send(200, 'second page!'); }
    }
  , section:
    { three: function(req, resp) { resp.send(200, 'three!'); }
    , four: function(req, resp) { resp.send(200, 'four!'); }
    }
  };


