'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* to make it more secure we use hash 8 times and salt, 
bc to hack they need to guess this on the top of username
 and password amount of times to hash in production you want 64 */
// to generate random data
var HASH_ROUNDS = 8;
// _ is a space, caps means its a constant and we dont want 
// to change it in the future, ti applies mostly to strings and numbers
// to generate hash
var TOKEN_SEED_LENGTH = 128; // how long the token will be, random number of bytes

var accountSchema = _mongoose2.default.Schema({

  passwordHash: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true
  },
  createdOn: {
    type: Date,
    default: function _default() {
      return new Date();
    }
  }
});

function pVerifyPassword(password) {
  var _this = this;

  return _bcrypt2.default.compare(password, this.passwordHash).then(function (result) {
    if (!result) {
      throw new _httpErrors2.default(400, 'AUTH - incorrect data');
    }
    return _this;
  });
}
function pCreateToken() {
  this.tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save().then(function (account) {
    // we have a token seed, sign === encrypt
    return _jsonwebtoken2.default.sign( // this line returns a promise that resolves a token
    { tokenSeed: account.tokenSeed }, process.env.PICS_SECRET_PASS); // when this promise resolves i have a token
  });
}
accountSchema.methods.pCreateToken = pCreateToken;
accountSchema.methods.pVerifyPassword = pVerifyPassword;

var Account = _mongoose2.default.model('account', accountSchema);

/* Hash variables:
    - SALT
    - Hashing algo (bcrypt)
    - password
    - rounds
 */

Account.create = function (username, email, password) {
  return _bcrypt2.default.hash(password, HASH_ROUNDS) // here starts SALT
  .then(function (passwordHash) {
    // here we have password hash
    password = null; // eslint-disable-line 
    var tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex'); // hex is used bc of http
    return new Account({
      username: username,
      email: email,
      passwordHash: passwordHash,
      tokenSeed: tokenSeed
    }).save();
  });
};

exports.default = Account;