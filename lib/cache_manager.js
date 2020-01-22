'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _repository = require('./repository');

var _repository2 = _interopRequireDefault(_repository);

var _s = require('./stores/s3');

var _s2 = _interopRequireDefault(_s);

var _object = require('./stores/object');

var _object2 = _interopRequireDefault(_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CacheManager {
  constructor(props = {}) {
    this.config = props.config || _config2.default;
    this.stores = props.stores || {};
  }

  store(name = null) {
    const storeName = name || this.getDefaultDriver();
    this.stores[storeName] = this.get(storeName);
    return this.stores[storeName];
  }

  get(name) {
    return name in this.stores ? this.stores[name] : this.resolve(name);
  }

  resolve(name) {
    const storeConfig = this.getConfig(name);
    const creatorMethodName = `_create${name.charAt(0).toUpperCase() + name.slice(1)}Driver`;

    if (!(creatorMethodName in this)) {
      throw new Error('Cache creator method does not exist');
    }

    return this[creatorMethodName](storeConfig);
  }

  getDefaultDriver() {
    return this.config.defaultDriver;
  }

  getConfig(name) {
    return this.config.stores[name];
  }

  _createS3Driver(driverConfig) {
    const store = new _s2.default(driverConfig.bucket, undefined, driverConfig.prefix || '');
    return this.repository(store);
  }

  _createObjectDriver() {
    return this.repository(new _object2.default());
  }

  repository(store) {
    return new _repository2.default(store);
  }
}

const cacheManager = conf => {
  const cacheConfig = conf || _config2.default;

  return new CacheManager({
    config: cacheConfig
  });
};

exports.default = cacheManager;
module.exports = exports.default;
