"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class CacheRepository {
  constructor(store) {
    this.store = store;
  }

  get(key) {
    return this.store.get(key);
  }

  forget(key) {
    return this.store.forget(key);
  }

  put(key, value, ttlMinutes = 0) {
    return this.store.put(key, value, ttlMinutes);
  }
}
exports.default = CacheRepository;
module.exports = exports.default;