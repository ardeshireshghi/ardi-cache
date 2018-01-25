import config from './config';
import CacheRepository from './repository';
import S3Store from './stores/s3';
import ObjectStore from './stores/object';

export class CacheManager {
  constructor(props = {}) {
    this.config = props.config || config;
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
    const store = new S3Store(driverConfig.bucket, undefined, driverConfig.prefix || '');
    return this.repository(store);
  }

  _createObjectDriver() {
    return this.repository(new ObjectStore());
  }

  repository(store) {
    return new CacheRepository(store);
  }
}

let cacheManagerInstance;

export default function cacheManager(conf) {
  if (!cacheManagerInstance) {
    const cacheConfig = conf || config;

    cacheManagerInstance = new CacheManager({
      config: cacheConfig
    });
  }

  return cacheManagerInstance;
}
