'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pRemoveProfileMock = exports.pCreateProfileMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _profile = require('../../model/profile');

var _profile2 = _interopRequireDefault(_profile);

var _accountMock = require('./account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pCreateProfileMock = function pCreateProfileMock() {
  var resultMock = {};

  return (0, _accountMock.pCreateAccountMock)().then(function (accountSetMock) {
    // mocking all the information (account, request, token)
    resultMock.accountSetMock = accountSetMock;

    return new _profile2.default({
      zipCode: _faker2.default.lorem.words(8),
      picture: _faker2.default.random.image(), // this gives the address to pic
      nickname: _faker2.default.lorem.words(5),
      category: _faker2.default.lorem.words(),
      account: accountSetMock.account._id
    }).save();
  }).then(function (profile) {
    resultMock.profile = profile;
    return resultMock;
  });
};
var pRemoveProfileMock = function pRemoveProfileMock() {
  return Promise.all([_profile2.default.remove({}), (0, _accountMock.pRemoveAccountMock)()]);
};

exports.pCreateProfileMock = pCreateProfileMock;
exports.pRemoveProfileMock = pRemoveProfileMock;