const redis = require("../config/redis");

const getCache = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

const setCache = async (key, value, ttl = 600) => {
  await redis.set(key, JSON.stringify(value), "EX", ttl);
};

module.exports = { getCache, setCache };
