
// test/basic.js - Basic route table parsing tests.
var test = require('tap').test
  , sinon = require('sinon');

function getRouter() { return require('./basic.routes'); }


test('require.extensions registration', function(t) {
  t.plan(1);

  require('../index');
  t.type(require.extensions['.routes'], 'function', '.routes handler must be a function');
});


test('router interface', function(t) {
  var router = require('./basic.routes');

  t.plan(4);
  t.type(router.route, 'function', 'exports a .route function');
  t.type(router.express, 'function', 'exports a .express function');
  t.type(router.handlers, 'function', 'exports a .handler function');
  t.type(router.load, 'function', 'exports a .load function');
});


test('path routing', function(t) {
  t.plan(3 * 3);

  var router = getRouter();

  function route(uri, controller, action) {
    var result = router.route(uri);
    t.assert(result, 'result matched');
    t.equal(result.mapping.controller, controller, 'correct matched route controller');
    t.equal(result.mapping.action, action, 'correct matched route action');
  }

  route('/home', 'home', 'index');
  route('/home?tab=featured', 'home', 'featured');
  route('/posts/:id/edit', 'posts', 'edit');
});


test('request object routing', function(t) {
  t.plan(3 * 4);

  var router = getRouter();

  function route(obj, method, controller, action) {
    var result = router.route(obj);
    t.assert(result, 'route matched');
    t.equal(result.method, method, 'correct matched route method');
    t.equal(result.mapping.controller, controller, 'correct matched route controller');
    t.equal(result.mapping.action, action, 'correct matched route action');
  }

  route({ method: 'GET', url: '/home' }, 'GET', 'home', 'index');
  route({ method: 'GET', url: '/posts/new' }, 'GET', 'posts', 'new');
  route({ method: 'POST', url: '/posts/new' }, 'POST', 'posts', 'create');
});


test('express support', function(t) {
  t.plan(4);

  var app = { get: function() { }, post: function() { } }
    , router = getRouter();

  sinon.spy(app, 'get');
  sinon.spy(app, 'post');

  t.throws(function() { router.express(app); }, 'express() before handlers() should throws');

  router.handlers(
    { home: { index: function() { } }
    , posts: { edit: function() { }, update: function() { } }
    });

  router.express(app);

  t.ok(app.get.calledWith('/home'), 'GET routes registered to express app');
  t.ok(app.get.calledWith('/posts/:id/edit'), 'GET routes with parameter registered to express app');
  t.ok(app.post.calledWith('/posts/:id/edit'), 'POST routes with paramter registered to express app');
});


test('router.load shortcut', function(t) {
  t.plan(2)

  var app = { }
    , handlers = { }
    , router = getRouter();

  sinon.stub(router, 'express');
  sinon.stub(router, 'handlers');

  router.load(app, handlers);
  t.ok(router.express.calledWith(app), 'app passed to express()');
  t.ok(router.handlers.calledWith(handlers), 'handlers passed to handlers()');
});


