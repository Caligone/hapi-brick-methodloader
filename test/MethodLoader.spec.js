// $lab:coverage:off$
'use strict';

var Code = require('code');
var Lab = require('lab');
var path = require('path');
var Sinon = require('sinon');
var lab = Lab.script();
var expect = Code.expect;

var MethodLoader = require('../lib/MethodLoader');

lab.suite('MethodLoader:class', () => {

  let mock = {
    server: require('./mock/Server'),
  };

  lab.test('it properly sets the default attributes', (endTest) => {
    let methodLoader = new MethodLoader(__dirname);
    expect(methodLoader).to.not.be.null();
    expect(methodLoader._pattern).to.be.equal('**/*.method.js');
    expect(methodLoader._dirname).to.be.equal(__dirname);
    endTest();
  });

  lab.test('it properly exposes the methods', (endTest) => {
    let methodLoader = new MethodLoader(__dirname);
    methodLoader.apply(mock.server, [path.join(__dirname, './mock/samples/a.js'), path.join(__dirname, './mock/samples/b.js')])
      .then(function (methods) {
        expect(methods).to.be.an.array().and.to.have.length(2);
        endTest();
      });
  });

  lab.test('it properly loads the files', (endTest) => {
    let methodLoader = new MethodLoader(__dirname);
    let stub = Sinon.stub(require('glob'), 'sync');
    stub.onFirstCall().returns([path.join(__dirname, './mock/samples/a.js'), path.join(__dirname, './mock/samples/b.js')]);
    methodLoader.process(mock.server)
      .then((methods) => {
        expect(methods).to.be.an.array().and.to.have.length(2);
        stub.restore();
        endTest();
      });
  });

  lab.test('it properly failed if an error happend during apply', (endTest) => {
      let methodLoader = new MethodLoader(__dirname);
      let stub = Sinon.stub(require('glob'), 'sync');
      stub.onFirstCall().returns([path.join(__dirname, '.mock/samples/c.js')]);
      methodLoader.process(mock.server)
        .catch((err) => {
          stub.restore();
          expect(err).to.be.an.array().and.to.have.length(1);
          endTest();
        });
  });

  lab.test('it properly failed if an error happend during apply method', (endTest) => {
      let methodLoader = new MethodLoader(__dirname);
      let stub = Sinon.stub(require('glob'), 'sync');
      stub.onFirstCall().returns([path.join(__dirname, './mock/samples/a.js'), path.join(__dirname, './mock/samples/b.js')]);
      let stubServer = Sinon.stub(mock.server, 'method');
      stubServer.onFirstCall().throws("TestError");
      methodLoader.process(mock.server)
        .catch((err) => {
          stub.restore();
          stubServer.restore();
          expect(err).to.be.an.array();
          endTest();
        });
  });
});

module.exports.lab = lab;
// $lab:coverage:on$
