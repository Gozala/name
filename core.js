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

module.exports = typeof(Name) !== 'undefined' ? Name : new function() {
  // Define character that we will use to prefix private names with
  var prefix = '\u2063'

  // Shim `Object.*` methods so that names prefixed with our special `prefix`
  // will not be included & will be defined as non-enumerable by default.
  var names = Object.getOwnPropertyNames
  var keys = Object.keys
  var defineProperties = Object.defineProperties
  var defineProperty = Object.defineProperty
  var create = Object.create

  function isPublic(name) { return name[0] !== prefix }
  function getOwnPublicNames(object) { return names(object).filter(isPublic) }
  function getOwnPublicKeys(object) { return keys(object).filter(isPublic) }
  function patch(descriptor) {
    names(descriptor).forEach(function(name) {
      if (!isPublic(name)) descriptor[name].enumerable = false
    })
    return descriptor
  }
  function defineOwnProperty(object, name, descriptor) {
    descriptor.enumerable = false
    return defineProperty(object, name, descriptor)
  }
  function defineOwnProperties(object, descriptor) {
    return defineProperties(object, patch(descriptor))
  }
  function createObject(prototype, descriptor) {
    return create(prototype, descriptor && patch(descriptor))
  }

  // Note we use bind only in order to hide source of the function when
  // `toString` is called on them.
  Object.defineProperty(Object, 'getOwnPropertyNames', {
    value: getOwnPublicNames.bind(Object)
  })
  Object.defineProperty(Object, 'keys', {
    value: getOwnPublicKeys.bind(Object)
  })
  Object.defineProperty(Object, 'defineProperties', {
    value: defineOwnProperties.bind(Object)
  })
  Object.defineProperty(Object, 'defineProperty', {
    value: defineOwnProperty.bind(Object)
  })
  Object.defineProperty(Object, 'create', {
    value: createObject.bind(Object)
  })


  return function Name(hint) {
    return prefix + (hint || '') + '@' + Math.random().toString(32).substr(2)
  }
}

});
