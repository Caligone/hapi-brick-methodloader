// $lab:coverage:off$
'use strict';

let server = {
  dependency: (dependencies, next) => {
    next(this, () => {});
  },
  expose: (key, value) => {
    this[key] = value;
  },
  method: (methods) => {
    this._methods = methods;
  },
  plugins: {
    knex: {
      client: 'mock'
    }
  }
};

module.exports = server;
// $lab:coverage:on$
