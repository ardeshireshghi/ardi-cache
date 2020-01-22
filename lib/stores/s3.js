'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.setPromisesDependency(_bluebird2.default);

class S3Store {
  constructor(bucket, connection, prefix = '') {
    this.bucket = bucket;
    this.prefix = prefix;
    this.setConnection(connection || this._createConnection());
  }

  put(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    return this.connection().putObject({
      Body: value,
      Bucket: this.bucket,
      Key: this.prefix + key
    }).promise();
  }

  get(key) {
    return this.connection().getObject({
      Bucket: this.bucket,
      Key: this.prefix + key
    }).promise().then(content => content.Body.toString()).catch(err => {
      if (err.name === 'NoSuchKey') {
        return _bluebird2.default.resolve(null);
      }

      return _bluebird2.default.reject(err);
    });
  }

  forget(key) {
    return this.connection().deleteObject({
      Bucket: this.bucket,
      Key: this.prefix + key
    }).promise();
  }

  setConnection(connection) {
    this._connection = connection;
  }

  connection() {
    return this._connection;
  }

  _createConnection() {
    return new _awsSdk2.default.S3();
  }
}
exports.default = S3Store;
module.exports = exports.default;