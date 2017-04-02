const path = require('path');
const grpc = require('grpc');

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 50051;
const PROTO_PATH = path.join(__dirname, 'counter.proto');

const counterProto = grpc.load(PROTO_PATH);

let server = new grpc.Server();

let counter = 0;

const add = (call, callback) => {
  counter += call.request.count;
  const res = {
    count: counter
  };
  callback(null, res);
};

const reset = (call, callback) => {
  counter = 0;
  const res = {
    count: counter
  };
  callback(null, res);
};

const get = (call, callback) => {
  const res = {
    count: counter
  };
  callback(null, res);
};

const methods = {
  add: add,
  reset: reset,
  get: get,
};

if (NODE_ENV === 'test') {
  module.exports = methods;
} else {
  server.addProtoService(counterProto.counter.CounterService.service, methods);
  server.bind('0.0.0.0:' + PORT, grpc.ServerCredentials.createInsecure());
  server.start();
}
