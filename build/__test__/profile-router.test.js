'use strict';

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

var _profileMock = require('./lib/profile-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('POST /profiles', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_profileMock.pRemoveProfileMock);

  test('POST /profiles, should get 200 if no errors and new profile', function () {
    var accountMock = null;
    return (0, _accountMock.pCreateAccountMock)().then(function (accountSetMock) {
      accountMock = accountSetMock;
      return _superagent2.default.post(apiURL + '/profiles').set('Authorization', 'Bearer ' + accountSetMock.token).send({
        nickname: 'joanna',
        zipCode: '981094',
        category: 'birds'
      });
    })
    // we are testing accountSetMock but its only available 
    // in different scope so we need to create new let in our scope
    .then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.account).toEqual(accountMock.account._id.toString());
      expect(response.body.nickname).toEqual('joanna');
      expect(response.body.zipCode).toEqual('981094');
      expect(response.body.category).toEqual('birds');
    });
  });
  test('POST /profiles returns 404 if wrong id', function () {
    return (0, _accountMock.pCreateAccountMock)().then(function (accountSetMock) {
      return _superagent2.default.post(apiURL + '/profiles/wrongid').set('Authorization', 'Bearer ' + accountSetMock.token).send({
        zipCode: _faker2.default.lorem.words(8),
        picture: _faker2.default.random.image(),
        nickname: _faker2.default.lorem.words(15)
      });
    }).then(Promise.reject).catch(function (err) {
      expect(err.status).toEqual(404);
    });
  });
  test('POST /profiles should show 400 if missing  token', function () {
    return (0, _accountMock.pCreateAccountMock)().then(function () {
      return _superagent2.default.post(apiURL + '/profiles').set('Authorization', 'Bearer ').send({
        zipCode: _faker2.default.lorem.words(8),
        picture: _faker2.default.random.image(),
        nickname: _faker2.default.lorem.words(15)
      });
    }).then(Promise.reject).catch(function (err) {
      expect(err.status).toEqual(400);
    });
  });

  test('GET /profiles/:id should respond with 200 if no errors', function () {
    var profileTest = null;
    return (0, _profileMock.pCreateProfileMock)().then(function (profile) {
      profileTest = profile;
      return _superagent2.default.get(apiURL + '/profiles/' + profile.profile._id);
    }).then(function (response) {
      expect(response.body.nickname).toEqual(profileTest.profile.nickname);
      expect(response.body.zipCode).toEqual(profileTest.profile.zipCode);
      expect(response.body.category).toEqual(profileTest.profile.category);
      expect(response.body._id).toBeTruthy();
    });
  });

  test('GET /profiles returns 404 if bad request ', function () {
    return _superagent2.default.get(apiURL + '/profiles/').then(Promise.reject).catch(function (err) {
      expect(err.status).toEqual(404);
    });
  });
});