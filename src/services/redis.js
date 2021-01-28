const Redis = require('ioredis')
const { async } = require('rxjs')
const redis = new Redis(
  {
    port: 6379,
    host: 'localhost'
  }
)

module.exports = {
  set: (key, val) => {
    redis.set(key, val, 'ex', 100000000000000000)
  },
  get: async (key) => {
    let res = await redis.get(key)
    return res
  }
}