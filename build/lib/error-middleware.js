'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (error, request, response, next) {
  // eslint-disable-line no-unused-vars
  _logger2.default.log(_logger2.default.ERROR, '__ERROR_MIDDLEWARE__');
  _logger2.default.log(_logger2.default.ERROR, error);
  // i know i have the property error.status
  if (error.status) {
    // checking if the message has a status if not run the error,
    _logger2.default.log(_logger2.default.INFO, 'Responded with a ' + error.status + ' code and message ' + error.message);
    return response.sendStatus(error.status);
  } // i know that if we are here its another type or error
  var errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('objectid failed')) {
    _logger2.default.log(_logger2.default.INFO, ' Responding with a 404 code'); // this is not a server problem its their problem
    return response.sendStatus(404);
  }
  if (errorMessage.includes('validation failed')) {
    _logger2.default.log(_logger2.default.INFO, ' Responding with a 400 code'); // this is not a server problem its their problem
    return response.sendStatus(400);
  }
  if (errorMessage.includes('duplicate key')) {
    // duplicate values
    _logger2.default.log(_logger2.default.INFO, ' Responding with a 409 code'); // this is not a server problem its their problem
    return response.sendStatus(409);
  }
  if (errorMessage.includes('unauthorized ')) {
    // no password
    _logger2.default.log(_logger2.default.INFO, ' Responding with a 401 code'); // this is not a server problem its their problem
    return response.sendStatus(401);
  }
  _logger2.default.log(_logger2.default.ERROR, 'Responded with a 500 error code'); // the only test not related to mongo errors
  _logger2.default.log(_logger2.default.ERROR, error);
  return response.sendStatus(500);
};
// we never put next here, we can but we dont