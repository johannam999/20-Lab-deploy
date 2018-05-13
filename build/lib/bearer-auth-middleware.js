'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var promisify = function promisify(callbackStyleFunction) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // we can have any amount of arguments using spread syntax 
    // bc we dont know which function we want to run, it gives back an array-like,
    // we have 2 arguments
    // fn is a  function we want to promisify
    // set of the arguments of the original function
    // console.log('hound', 'is, 'cute')

    return new Promise(function (resolve, reject) {
      callbackStyleFunction.apply(undefined, args.concat([function (error, data) {
        if (error) {
          return reject(error); // going to the next .catch if error
        }
        return resolve(data); // going to the next .then
      }])); // destructuring args
    });
  };
};
// if (...args) inside the function call then we mean arguments
// if inside function we mean array values

exports.default = function (request, response, next) {
  if (!request.headers.authorization) {
    return next(new _httpErrors2.default(400, 'AUTH - invalid request'));
  }
  var token = request.headers.authorization.split('Bearer ')[1];
  if (!token) {
    return next(new _httpErrors2.default(400, 'AUTH - invalid request')); // sending naked token
  }
  return promisify(_jsonwebtoken2.default.verify)(token, process.env.PICS_SECRET_PASS)
  // here is token and secret, token and process... are callback(... args)
  .catch(function (error) {
    return Promise.reject(new _httpErrors2.default(400, 'AUTH - jsonwebtoken Error ' + error));
  }) // if theres a problem in the promisify we can have catch
  .then(function (decryptedToken) {
    return _account2.default.findOne({ tokenSeed: decryptedToken.tokenSeed }); // we are getting token seed
  }) // finding token seed
  .then(function (account) {
    if (!account) {
      return next(new _httpErrors2.default(400, 'AUTH - invalid request'));
    }
    request.account = account;
    return next();
  }).catch(next);
};