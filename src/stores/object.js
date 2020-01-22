export default class ObjectStore {
  constructor(store) {
    this.store = store || {};
  }

  async put(key, value, minutes = 0) {
    this.store[key] = {
      value,
      expiresAt: this._calculateExpiry(minutes)
    };

    return true;
  }

  async get(key) {
    if (!(key in this.store)) {
      return null;
    }

    const item = this.store[key];

    if (item.expiresAt > 0 && item.expiresAt < new Date()) {
      return null;
    }

    return item.value;
  }

  async forget(key) {
    if (this.store[key]) {
      delete this.store[key];
      return true;
    }

    return false;
  }

  _calculateExpiry(minutes) {
    return minutes === 0 ? 0 : new Date().getTime() + (minutes * 60 * 1000);
  }
}
