const keys = require('../config/keys')

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: '192.168.99.100',
      port: '3306',
      database: 'matcha',
      user: keys.user,
      password: keys.password
    },
    pool: {
      min: 2,
      max: 10
    },
    seeds: {
      directory: './seeds',
    }
  },
  staging: {
    client: 'mysql',
    connection: {
      database: 'matcha',
      user: keys.user,
      password: keys.password
    },
    pool: {
      min: 2,
      max: 10
    },
    seeds: {
      directory: './seeds',
    }
  },
  production: {
    client: 'mysql',
    connection: {
      database: 'matcha',
      user: keys.user,
      password: keys.password
    },
    pool: {
      min: 2,
      max: 10
    },
    seeds: {
      directory: './seeds',
    }
  }
};
