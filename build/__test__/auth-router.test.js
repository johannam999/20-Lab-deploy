'use strict';

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe(' AUTH ROUTER', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);

  test('POST should return a 200 status code and a token', function () {
    return _superagent2.default.post(apiURL + '/signup').send({
      username: _faker2.default.internet.userName(),
      email: _faker2.default.internet.email(),
      password: _faker2.default.lorem.words(5)
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
    });
  });
  test(' 400 if no email', function () {
    return _superagent2.default.post(apiURL + '/signup').send({
      username: _faker2.default.internet.userName(),
      password: _faker2.default.lorem.words(5)
    }).then(Promise.reject).catch(function (err) {
      expect(err.status).toEqual(400);
    });
  });
  test('409 due to duplicate firstName', function () {
    return _superagent2.default.post(apiURL + '/signup').send({
      username: 'joanna',
      email: 'joanna@joanna.com',
      password: 'bum'
    }).then(function () {
      return _superagent2.default.post(apiURL + '/signup').send({
        username: 'joanna',
        email: 'joanna@joanna.com',
        password: 'nauka'
      });
    }).then(Promise.reject).catch(function (err) {
      expect(err.status).toEqual(409);
    });
  });

  describe('GET /login', function () {
    test('GET /login should get a 200 status code and a token', function () {
      return (0, _accountMock.pCreateAccountMock)().then(function (mock) {
        return _superagent2.default.get(apiURL + '/login').auth(mock.request.username, mock.request.password); // this line is important
      }).then(function (response) {
        // when I login, I get a 200 status code and a token
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
    });
    test(' 400 if no password', function () {
      return _superagent2.default.get(apiURL + '/login').send({
        username: _faker2.default.internet.userName()
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(400);
      });
    });
  });
  test(' 404 if wrong login', function () {
    return _superagent2.default.get(apiURL + '/wrongLogin').then(Promise.reject).catch(function (err) {
      expect(err.status).toEqual(404);
    });
  });
});