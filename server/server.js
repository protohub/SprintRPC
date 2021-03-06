module.exports = function (env) {
  var express = require('express');
  var app = express();
  var db = require('./db')(env.get('db'));

  // Whitelist
  if (env.get('ADMINS')) {
    env.set('WHITELIST', env.get('ADMINS').split(/\s*,\s*/).map(function (username) {
      return username.toLowerCase();
    }));
  } else {
    env.set('WHITELIST', []);
  }

  // bz
  // var bugzilla = env.get('OFFLINE') ? require('../offline/bz.js') : bz.createClient();
  var bugzilla = require('../offline/bz.js');

  app.use(express.logger('dev'));
  app.use(express.compress());

  app.use(express.json());
  app.use(express.urlencoded());

  // Session
  app.use(express.cookieParser());
  app.use(express.cookieSession({
    secret: 'secret'
  }));
  app.use(express.csrf());

  app.use(express.static('./app'));
  require('./routes')(env, app, db, bugzilla);

  //Errors
  app.use(function errorHandler (err, req, res, next) {
    if (!err) {
      return next();
    }

    err.statusCode = err.statusCode || 500;

    // Log
    if (err.statusCode >= 500 || err.statusCode < 400) {
      console.log(err.stack || err);
    }

    res.send(err.statusCode, {
      error: err.message
    });

  });

  return app;
};
