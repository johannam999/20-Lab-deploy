'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pRemoveAccountMock = exports.pCreateAccountMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pCreateAccountMock = function pCreateAccountMock() {
  var mock = {};
  mock.request = {
    username: _faker2.default.internet.userName(),
    email: _faker2.default.internet.email(),
    password: _faker2.default.lorem.words(5)
  };
  return _account2.default.create(mock.request.username, mock.request.email, mock.request.password).then(function (account) {
    mock.account = account;
    return account.pCreateToken(); // this line changes the token Seed
  }) // after creating token we send it below to ..then
  .then(function (token) {
    mock.token = token; // token is the actual token
    // here, I know that account has changed (tokenSeed)
    // up to here we have object with 3 properties(request, account, token)
    return _account2.default.findById(mock.account._id);
  }).then(function (account) {
    // here we get account from the top
    mock.account = account;
    return mock;
  }); // this continues to the auth-router.test.js POST . then ((account) => {
  //  const mockAccount...
  // })
};

var pRemoveAccountMock = function pRemoveAccountMock() {
  return _account2.default.remove({});
};

exports.pCreateAccountMock = pCreateAccountMock;
exports.pRemoveAccountMock = pRemoveAccountMock;