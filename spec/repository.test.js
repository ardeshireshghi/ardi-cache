import { expect } from 'chai';
import CacheRepository from '../src/repository';
import S3Store from '../src/stores/s3';
import ObjectStore from '../src/stores/object';
import config from '../src/config';

describe('#CacheRepository', () => {
  describe('#constructor', () => {
    let repository;

    it('Should create a new repository instance', () => {
      repository = new CacheRepository();
      expect(repository).to.be.instanceof(CacheRepository);
    });

    it('Should set the correct store', () => {
      repository = new CacheRepository(new S3Store());
      expect(repository.store).to.be.instanceof(S3Store);
    });
  });

  describe('#get,#put', () => {
    let repository;

    describe('#ObjectStore', () => {
      it('Should return the cache key value with object store', (done) => {
        repository = new CacheRepository(new ObjectStore());

        repository.put('foo', 'bar')
        .then(() => {
          return repository.get('foo');
        })
        .then((value) => {
          expect(value).to.equal('bar');
          done();
        });
      });

      it('Should return null when cache key does not exist', (done) => {
        repository = new CacheRepository(new ObjectStore());
        repository.get('foo')
        .then((value) => {
          expect(value).to.equal(null);
          done();
        });
      });
    });

    describe('#S3Store', () => {
      beforeEach((done) => {
        repository = new CacheRepository(new S3Store(config.stores.s3.bucket));
        repository.forget('foo').then(() => {
          done();
        })
      });

      it('Should return the cache key value with S3 store', (done) => {
        repository.put('foo', 'bar')
        .then(() => {
          return repository.get('foo');
        })
        .then((value) => {
          expect(value).to.equal('bar');
          done();
        });
      });

      it('Should return null when cache key does not exist', (done) => {
        repository.get('foo')
        .then((value) => {
          expect(value).to.equal(null);
          done();
        });
      });
    });
  });
});
