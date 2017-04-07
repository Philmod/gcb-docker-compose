module.exports = (opts) => {
  let redisClient = opts.redisClient;
  let counterRedisKey = opts.counterRedisKey;

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

  return methods;
}
