const path = require('path');
const grpc = require('grpc');
const redis = require('redis');

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 50051;

// Redis client.
const createRedisClient = (env) => {
  const opts = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
  };
  if (env === 'test') {
    return require('fakeredis').createClient(opts);
  }
  return require('redis').createClient(opts);
}
const redisClient = createRedisClient(NODE_ENV);
const counterRedisKey = 'gcb-docker-compose-counter'

// grpc proto.
const PROTO_PATH = path.join(__dirname, 'counter.proto');
const counterProto = grpc.load(PROTO_PATH);
let server = new grpc.Server();

// Methods.
let counterStream;
const add = (call, callback) => {
  redisClient.incrby(counterRedisKey, call.request.count, (err, counter) => {
    counterStream && counterStream.write(parseInt(counter));
    callback(err, {
      count: parseInt(counter),
    });
  });
};

const reset = (call, callback) => {
  redisClient.set(counterRedisKey, 0, (err, counter) => {
    counterStream && counterStream.write(0);
    callback(err, {
      count: 0
    });
  });
};

const get = (call, callback) => {
  redisClient.get(counterRedisKey, (err, counter) => {
    callback(err, {
      count: parseInt(counter),
    });
  });
};

const watch = (stream) => {
  counterStream = stream;
};

const methods = {
  add: add,
  reset: reset,
  get: get,
  watch: watch,
};

// Start grpc server.
server.addProtoService(counterProto.counter.CounterService.service, methods);
server.bind('0.0.0.0:' + PORT, grpc.ServerCredentials.createInsecure());
server.start();

module.exports = methods;
