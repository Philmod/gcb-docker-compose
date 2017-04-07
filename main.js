const path = require('path');
const grpc = require('grpc');
const redis = require('redis');

const PORT = process.env.PORT || 50051;

// Redis client.
const opts = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379
};
const redisClient = redis.createClient(opts);

// Counter methods.
const counter = require('./counter')({
  redisClient: redisClient,
  counterRedisKey: 'gcb-docker-compose-counter',
});

// grpc proto and server.
const PROTO_PATH = path.join(__dirname, 'counter.proto');
const counterProto = grpc.load(PROTO_PATH);
let server = new grpc.Server();
server.addProtoService(counterProto.counter.CounterService.service, counter);
server.bind('0.0.0.0:' + PORT, grpc.ServerCredentials.createInsecure());
server.start();
