import sinon from 'sinon';
import { expect } from 'chai';

import ObjectStore from '../../src/stores/object';


describe('#ObjectStore', () => {
  describe('#constructor', () => {
    it('Should create a new object store', () => {
      const store = new ObjectStore();
      expect(store).to.be.instanceof(ObjectStore);
    });
  });

  describe('#get', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers(Date.now());
    });

    describe('When cache key exists', () => {
      describe('and the cache is not expired', () => {
        it('Should return the item from cache', async () => {
          const store = new ObjectStore();
          await store.put('foo', 'bar', 1);

          expect(await store.get('foo')).to.equal('bar');
        });
      });

      describe('when the cache is set to NO expiry', () => {
        it('Should return the item', async () => {
          const store = new ObjectStore();
          await store.put('foo', 'bar', 0);
          clock.tick('30:00'); // go to 30 mins later

          expect(await store.get('foo')).to.equal('bar');
        });
      });

      describe('when the cache is expired', () => {
        it('Should return null', async () => {
          const store = new ObjectStore();
          await store.put('foo', 'bar', 1);
          clock.tick('01:01'); // go to one minute one second later

          expect(await store.get('foo')).to.equal(null);
        });
      });
    });

    describe('When cache key does NOT exist', () => {
      it('Should return null', async () => {
        const store = new ObjectStore();
        expect(await store.get('foo')).to.equal(null);
      });
    });

    afterEach(() => {
      clock.restore();
    });
  });

  describe('#put', () => {
    it('Should create the item and return true', async () => {
      const store = new ObjectStore();
      expect(await store.put('foo', 'bar', 1)).to.be.true;
    });
  });

  describe('#forget', () => {
    describe('when cache item exists', () => {
      let store;
      let result;

      beforeEach(async () => {
        store = new ObjectStore();
        await store.put('foo', 'bar', 1);
        result = await store.forget('foo');
      });

      it('should return true', () => {
        expect(result).to.be.true;
      });

      it('should remove the cache', async () => {
        expect(await store.get('foo')).to.be.null;
      });
    });

    describe('when cache item does NOT exist', () => {
      let store;

      beforeEach(async () => {
        store = new ObjectStore();
      });

      it('should return false', async () => {
        expect(await store.forget('foo')).to.be.false;
      });
    });
  });
});
