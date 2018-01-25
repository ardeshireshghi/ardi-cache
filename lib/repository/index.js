export default class CacheRepository {
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