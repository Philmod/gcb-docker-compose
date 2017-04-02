const should = require('should');
const methods = require('../index.js');

describe('unit tests', () => {

  describe('reset', () => {

    beforeEach(done => {
      const call = {
        request: {
          count: 1
        }
      };
      methods.add(call, done);
    });

    it('should reset the counter', (done) => {
      methods.reset(null, (err, res) => {
        should.not.exist(err);
        res.count.should.equal(0);
        done();
      });
    });

  });

  describe('Add', () => {

    beforeEach(done => {
      methods.reset(null, done);
    });

    it('should increment the counter', (done) => {
      const call = {
        request: {
          count: 1
        }
      };
      methods.add(call, (err, res) => {
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
      methods.add(call, (err, res) => {
        should.not.exist(err);
        res.count.should.equal(-1);
        done();
      });
    });

  });

});
