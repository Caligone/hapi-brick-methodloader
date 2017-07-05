'use strict';

const Loader = require('hapi-brick-loader');

class MethodLoader extends Loader {

  constructor (dirname) {
    super(dirname, '**/*.method.js');
  }

  apply (server, matches) {
    var methods = [];
    var errors = [];
    matches.forEach( m => {
      try {
        const methodsFromFile = require(m);
        server.method(methodsFromFile.name, methodsFromFile.handler);
        methods.push([methodsFromFile]);
      } catch (err) {
        errors.push(err);
      }
    });
    if (errors.length > 0) {
      return Promise.reject(errors);
    }
    return Promise.resolve(methods);
  }

}

module.exports = MethodLoader;
