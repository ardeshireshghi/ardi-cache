import { expect } from 'chai';
import cacheManager, { CacheManager } from '../src/cache_manager';
import CacheRepository from '../src/repository';
import S3Store from '../src/stores/s3';
import config from '../src/config';

describe('#cacheManager - singleton instance', () => {
  it('should return an instance of CacheManager', () => {
    const cache = cacheManager();
    expect(cache).to.be.instanceof(CacheManager);
  });

  it('should return same instance of CacheManager', () => {
    const cache1 = cacheManager();
    const cache2 = cacheManager();
    expect(cache1).to.equal(cache2);
  });
});

describe('#CacheManager', () => {
  describe('#constructor', () => {
    let cache;

    before(() => {
      cache = new CacheManager();
    });

    it('Should create a new CacheManager instance', () => {
      expect(cache).to.be.instanceof(CacheManager);
    });

    it('Should use a default config', () => {
      expect(cache.config).to.deep.equal(config);
    });

    it('Should use a custom config', () => {
      const customConfig = {
        stores: {
          s3: {
            bucket: 'mycustomStorebucket',
          }
        }
      };

      cache = new CacheManager({
        config: customConfig
      });

      expect(cache.config).to.deep.equal(customConfig);
    });
  });

  describe('#store', () => {
    let cache;

    before(() => {
      cache = new CacheManager();
    });

    it('Should get the repository with default store', () => {
      const { defaultDriver } = config;
      const store = cache.store();
      expect(store).to.be.instanceof(CacheRepository);
      expect(store.store).to.be.instanceof(S3Store);
    });

    it('Should get the default repository in different calls', () => {
      const { defaultDriver } = config;
      const store1 = cache.store();
      const store2 = cache.store();
      expect(store1).to.equal(store2);
    });

     it('Should get repository for an existing driver', () => {
      const { defaultDriver } = config;
      const store = cache.store('object');
      expect(store).to.be.instanceof(CacheRepository);
    });

     it('Should throw error for none existing driver', () => {
      const { defaultDriver } = config;
      const getInvalidStore = () => {
        return cache.store('invalidstore');
      };

      expect(getInvalidStore).to.throw(Error);
    });
  });
})
