'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopServer = exports.startServer = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _authRouter = require('../route/auth-router');

var _authRouter2 = _interopRequireDefault(_authRouter);

var _profileRouter = require('../route/profile-router');

var _profileRouter2 = _interopRequireDefault(_profileRouter);

var _loggerMiddleware = require('./logger-middleware');

var _loggerMiddleware2 = _interopRequireDefault(_loggerMiddleware);

var _errorMiddleware = require('./error-middleware');

var _errorMiddleware2 = _interopRequireDefault(_errorMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)(); // assign express to app =server
var server = null;

// app.use(loggerMiddleware)

app.use(_loggerMiddleware2.default); // call method use so express can access routes
app.use(_authRouter2.default);
// if the app.use wont find the routes it will send it to error-middleware
app.use(_profileRouter2.default);

app.all('*', function (request, response) {
  // built-in method
  _logger2.default.log(_logger2.default.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
}); // catch all route, shows error if no route registered

app.use(_errorMiddleware2.default); // this error is from .catch(next)

var startServer = function startServer() {
  return _mongoose2.default.connect(process.env.MONGODB_URI).then(function () {
    server = app.listen(process.env.PORT, function () {
      _logger2.default.log(_logger2.default.INFO, 'Server is listening on port ' + process.env.PORT);
    });
  });
};

var stopServer = function stopServer() {
  return _mongoose2.default.disconnect().then(function () {
    server.close(function () {
      _logger2.default.log(_logger2.default.INFO, 'Server is off'); // we can add json.strigify here to see the error
    });
  });
};

// server turns on and off right after executing the test

exports.startServer = startServer;
exports.stopServer = stopServer;