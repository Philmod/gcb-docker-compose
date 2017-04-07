const should = require('should');
const Counter = require('../counter.js');
const redis = require('fakeredis');

describe('counter', () => {

  let counter;

  before(() => {
    counter = Counter({
      redisClient: redis.createClient(),
      counterRedisKey: 'counterRedisKey',
    });
  })

  describe('reset', () => {

    beforeEach(done => {
      const call = {
        request: {
          count: 1
        }
      };
      counter.add(call, done);
    });

    it('should reset the counter', (done) => {
      counter.reset(null, (err, res) => {
        should.not.exist(err);
        res.count.should.equal(0);
        done();
      });
    });

  });

  describe('Add', () => {

    beforeEach(done => {
      counter.reset(null, done);
    });

    it('should increment the counter', (done) => {
      const call = {
        request: {
          count: 1
        }
      };
      counter.add(call, (err, res) => {
        should.not.exist(err);
        res.count.should.equal(1);
        done();
      });
    });

    it('should decrement the counter', (done) => {
      const call = {
        request: {
          count: -1
        }
      };
      counter.add(call, (err, res) => {
        should.not.exist(err);
        res.count.should.equal(-1);
        done();
      });
    });

  });

});
