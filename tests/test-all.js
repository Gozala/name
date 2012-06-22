/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true browser: true devel: true
         forin: true latedef: false */
/*global define: true, Cu: true, __URI__: true */
;(function(id, factory) { // Module boilerplate :(
  if (typeof(define) === 'function') { // RequireJS
    define(factory);
  } else if (typeof(require) === 'function') { // CommonJS
    factory.call(this, require, exports, module);
  } else if (~String(this).indexOf('BackstagePass')) { // JSM
    factory(function require(uri) {
      var imports = {};
      Cu.import(uri, imports);
      return imports;
    }, this, { uri: __URI__, id: id });
    this.EXPORTED_SYMBOLS = Object.keys(this);
  } else {  // Browser or alike
    var globals = this
    factory(function require(id) {
      return globals[id];
    }, (globals[id] = {}), { uri: document.location.href + '#' + id, id: id });
  }
}).call(this, 'loader', function(require, exports, module) {

'use strict';

var Name = require('../core');

function iteratedNames(object) {
  var names = []
  for (var name in object) names.push(name)
  return names
}

exports['test Object.keys'] = function(assert) {
  var secret = Name()

  var object = { foo: 1, bar: 2 }
  object[secret] = 3

  assert.deepEqual(Object.keys(object), [ 'foo', 'bar' ],
                   'object keys does not includes private name')
  assert.equal(object[secret], 3, 'private defined')
}

exports['test Object.getOwnPropertyNames'] = function(assert) {
  var secret = Name()

  var object = { foo: 1, bar: 2 }
  object[secret] = 3

  assert.deepEqual(Object.getOwnPropertyNames(object), [ 'foo', 'bar' ],
                   'object keys does not includes private name')
  assert.equal(object[secret], 3, 'private defined')
}

exports['test Object.defineProperties'] = function(assert) {
  var secret1 = Name()
  var secret2 = Name()

  var object = { foo: 1, bar: 2 }
  var descriptor = { baz: { value: 3 } }
  descriptor[secret1] = { enumerable: true, value: 4 }
  descriptor[secret2] = { enumerable: false, value: 5 }

  Object.defineProperties(object, descriptor)

  assert.deepEqual(Object.keys(object), [ 'foo', 'bar' ],
                   'object keys does not includes private name')
  assert.deepEqual(Object.getOwnPropertyNames(object).sort(),
                  [ 'foo', 'bar', 'baz' ].sort(),
                   'object keys does not includes private name')

  assert.deepEqual(iteratedNames(object).sort(),
                   [ 'foo', 'bar'].sort(),
                   'object iterator does not includes private names')

  assert.equal(object[secret1], 4, 'enumerable private is defined')
  assert.equal(object[secret2], 5, 'non-enumerable private is defined')
}

exports['test Object.defineProperty'] = function(assert) {
  var secret1 = Name()
  var secret2 = Name()

  var object = { foo: 1, bar: 2 }
  Object.defineProperty(object, 'baz', {
    value: 3
  })
  Object.defineProperty(object, secret1, {
    enumerable: true, value: 4
  })
  Object.defineProperty(object, secret2, {
    enumerable: false, value: 5
  })

  assert.deepEqual(Object.keys(object), [ 'foo', 'bar' ],
                   'object keys does not includes private name')
  assert.deepEqual(Object.getOwnPropertyNames(object).sort(),
                  [ 'foo', 'bar', 'baz' ].sort(),
                   'object keys does not includes private name')

  assert.deepEqual(iteratedNames(object).sort(),
                   [ 'foo', 'bar'].sort(),
                   'object iterator does not includes private names')

  assert.equal(object[secret1], 4, 'enumerable private is defined')
  assert.equal(object[secret2], 5, 'non-enumerable private is defined')
}

if (require.main == module) require('test').run(exports)

});
