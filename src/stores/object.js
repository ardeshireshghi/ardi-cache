import Promise from 'bluebird';

export default class ObjectStore {
  constructor(store) {
    this.store = store || {};
  }

  put(key, value, minutes = 0) {
    this.store[key] = value;
    return Promise.resolve(value);
  }

  get(key) {
    const cache = key in this.store ? this.store[key] : null;
    return Promise.resolve(cache);
  }

  forget(key) {
    delete this.store[key];
    return Promise.resolve();
  }
}
