const path = require('path');
const grpc = require('grpc');
const should = require('should');

const PORT = process.env.PORT || 50051;
const PROTO_PATH = path.join(__dirname, '..', 'counter.proto');
const counterProto = grpc.load(PROTO_PATH);

describe('integration tests', () => {

  let server;
  let client;

  before(() => {
    // Start server.
    server = require('../index.js').server;
  });

  before(() => {
    // Create a grpc client.
    client = new counterProto.counter.CounterService(
      'localhost:' + PORT,
      grpc.credentials.createInsecure()
    );
  });

  after(() => {
    server.forceShutdown();
  });

  describe('reset', () => {

    beforeEach(done => {
      client.add({count: 1}, done);
    });

    it('should reset the counter', (done) => {
      client.reset({}, (err, res) => {
        should.not.exist(err);
        res.count.should.equal(0);
        done();
      });
    });

  });

  describe('add', () => {

    beforeEach(done => {
      client.reset({}, done);
    });

    it('should increment the counter', (done) => {
      client.add({count: 1}, (err, res) => {
        should.not.exist(err);
        res.count.should.equal(1);
        done();
      });
    });

    it('should decrement the counter', (done) => {
      client.add({count: -1}, (err, res) => {
        should.not.exist(err);
        res.count.should.equal(-1);
        done();
      });
    });

  });

  // Maybe add a test to prove than restarting the server doesn't restart the counter.

});
