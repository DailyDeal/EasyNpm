(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("easymodel", [], factory);
	else if(typeof exports === 'object')
		exports["easymodel"] = factory();
	else
		root["easymodel"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _underscore = __webpack_require__(1);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _easylogs = __webpack_require__(2);
	
	var _easylogs2 = _interopRequireDefault(_easylogs);
	
	var _types2 = __webpack_require__(3);
	
	var _types3 = _interopRequireDefault(_types2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var EasyModel = function () {
	  // We are gonna overwrite it, but still, for readability, let's assign it to an Object
	  var _data = {};
	  var _model = {};
	  var _types = {};
	
	  var EasyModel = function () {
	    // Constructor's called on class instanciation. Expects an Object
	    function EasyModel(options) {
	      _classCallCheck(this, EasyModel);
	
	      this.logger = new _easylogs2.default();
	
	      if (_underscore2.default.isObject(options)) {
	        this.logger.info('EasyModel constructor called. Options: ' + this.logger.beautify(options));
	        this.setValue(options);
	      } else {
	        this.logger.warn('You are creating an empy EasyModel\'s instance, is that what you want? Expected an argument of type Object but got ' + (typeof options === 'undefined' ? 'undefined' : _typeof(options)) + ' instead');
	      }
	    }
	
	    // Here we define our default fieldTypes (what about specific classes for each of them?)
	    // dataTypes = {
	    //   text: {
	    //     type: 'text',
	    //     // FIXME Naming convention sucks
	    //     validation: {
	    //       validator: /.*/g,          // String || Array || Number || Function
	    //       beforeValidate: [],        // Array || Function, execute if provide
	    //       afterValidate: () => true  // Array || Function, execute if provide
	    //     }
	    //   },
	
	    _createClass(EasyModel, [{
	      key: 'validate',
	
	
	      // Should return an object like:
	      // {
	      //   result: Bool
	      //   reason: String
	      // }
	      value: function validate(type, value, propName) {
	        // Accumulator of validations result. Already contains one true value so it will pass the validation
	        // if no validators are provided
	        var validationResult = [true];
	        // Custom typeof string. See method typeOf for more informations about it
	        var typeofValue = this.typeOf(value);
	        var dataType = this.getDataType(type);
	
	        // If RegExp
	        if (dataType.pattern) {
	          var patternResult = false;
	          // TODO: Here we are somehow validating the RegExp, but it shouldn't happen here but when the RegExp is set
	          if (_underscore2.default.isRegExp(dataType.pattern)) {
	            patternResult = new RegExp(dataType.pattern).test(value);
	          }
	          validationResult.push(patternResult);
	        }
	        // If max length
	        if (dataType.length) {
	          var lengthResult = true;
	          switch (typeofValue) {
	            case 'string':
	            case 'number':
	              {
	                lengthResult = value.toString().length <= dataType.length;
	                break;
	              }
	            case 'array':
	              {
	                lengthResult = value.length <= dataType.length;
	                break;
	              }
	            default:
	              {
	                this.logger.warn('Cannot use length validator to validate ' + typeofValue + ' (Property: ' + propName + ')');
	              }
	          }
	          validationResult.push(lengthResult);
	        }
	        // If required (we check if a value exists)
	        if (dataType.required) {
	          var tmpValue = typeofValue === 'number' ? value.toString() : value;
	          validationResult.push(!_underscore2.default.isEmpty(tmpValue));
	        }
	        // A custom function is passed
	        if (dataType.validator) {
	          var validatorResult = true;
	          if (_underscore2.default.isFunction(dataType.validator)) {
	            validatorResult = dataType.validator(value);
	          } else {
	            throw new Error('Trying to execute validator, but found it\'s not a function. Please check it');
	          }
	          validationResult.push(validatorResult);
	        }
	
	        return validationResult.every(function (result) {
	          return result;
	        });
	      }
	
	      // newValue: Any    - The new value/values
	      // propName: String - Refer to the name of the field, optional
	      // Method used to update a property value.
	      // On the model is also possible to define before/after hooks that will be executed respectively
	      // before and after setting the value
	
	    }, {
	      key: 'setValue',
	      value: function setValue(newValue, propName) {
	        var type = _model[propName];
	
	        // Is the property an existing model's prop?
	        if (!_model[propName]) {
	          throw new Error('The property ' + propName + ' doesn\'t match any prop on the Model');
	        }
	
	        // Fire before hook, if existing
	        // check if before hook exists, procede if YES
	        //   execute it, if there's a returned value, that's the newValue
	
	        // Validate the new value
	        if (!this.validate(type, newValue, propName)) {
	          throw new Error('Validation failed. Can\'t assign value: ' + newValue + ' to ' + propName);
	        }
	
	        // If a propName is passed it means we want to update one specific prop, so we transform it to and Object
	        // in order to make it digestible by Object.assign
	        if (propName) {
	          newValue = _defineProperty({}, propName, newValue);
	        }
	
	        _data = Object.assign(_data, newValue);
	
	        // Fire after hook, if existing
	        // check if after hook exists, procede if YES
	        //   execute it
	      }
	    }, {
	      key: 'getValue',
	      value: function getValue(propName) {
	        var value = _data[propName];
	
	        if (!value) {
	          throw new Error('Can\'t read value of ' + propName + ' because it\'s undefined');
	        }
	
	        return value;
	      }
	
	      /******************
	      *** Utils
	      ******************/
	
	    }, {
	      key: 'extendType',
	      value: function extendType() {}
	    }, {
	      key: 'typeOf',
	      value: function typeOf(element) {
	        var _element = (0, _underscore2.default)(element);
	
	        if (_element.isNaN()) {
	          return 'NaN';
	        }
	        if (_element.isNull()) {
	          return 'null';
	        }
	        if (_element.isArray()) {
	          return 'array';
	        }
	        if (_element.isString()) {
	          return 'string';
	        }
	        if (_element.isRegExp()) {
	          return 'regexp';
	        }
	        if (_element.isNumber()) {
	          return 'number';
	        }
	        if (_element.isBoolean()) {
	          return 'boolean';
	        }
	        if (_element.isFunction()) {
	          return 'function';
	        }
	        if (_element.isUndefined()) {
	          return 'undefined';
	        }
	        if (_element.isObject()) {
	          return 'object';
	        }
	        this.logger.warn('typeOf of ' + element + ' element failed. Check the element and check the function');
	        return 'undefined';
	      }
	    }, {
	      key: 'getDataType',
	      value: function getDataType(type) {
	        var capitalize = function capitalize(s) {
	          return s.charAt(0).toUpperCase() + s.slice(1);
	        };
	        var typeKey = capitalize(type);
	        var dataType = new _types3.default[typeKey]();
	
	        if (!dataType) {
	          throw new Error('Unable to find type ' + type);
	        }
	
	        return type;
	      }
	    }, {
	      key: 'model',
	      set: function set(model) {
	        var _this = this;
	
	        if (_underscore2.default.isObject(model)) {
	          this.logger.info('Setting new model: ' + this.logger.beautify(model));
	        } else {
	          throw new Error('Can\'t set model to ' + (typeof model === 'undefined' ? 'undefined' : _typeof(model)) + '. Please provide an Object instead');
	        }
	
	        // TODO: Check if the context is the correct one.. probably not tho.
	        // NOTE: I actually believe the context is the correct one ;D
	        (0, _underscore2.default)(model).each(function (type, propName) {
	          Object.defineProperty(_this, propName, {
	            // Define setter/getter for each propName in the model
	            set: function set(newValue) {
	              return _this.setValue(newValue, propName);
	            },
	            get: function get() {
	              return _this.getValue(propName);
	            }
	          });
	
	          if (_underscore2.default.isString(model[propName])) {
	            // check if model already contains the type (ex. 'text')
	            //   if YES, skip
	            //   if NO
	            //      generate new Type instance
	            //      store it into _types
	          } else if (_underscore2.default.isObject(model[propName])) {
	            // Extend Type
	            // generate new Type instance
	          } else {
	              // Throw error, we only accept strings or objects
	            }
	        });
	
	        _model = model;
	      },
	      get: function get() {
	        return _model;
	      }
	    }]);
	
	    return EasyModel;
	  }();
	
	  return EasyModel;
	}();
	
	exports.default = EasyModel;
	
	// let EasyModel =(function () {
	//   // let data = {};
	//   class EasyModel {
	//     // dataTypes = {
	//     //   text: {
	//     //     type: 'text',
	//     //     pattern: /.*/g
	//     //    },
	//     //    number: {
	//     //      type: 'number',
	//     //      pattern: /^\d+$/
	//     //    }
	//     // }
	//     // constructor(options) {
	//     //   data = options;
	//     //
	//     //   console.log('EasyModel initialized.');
	//     // }
	//
	//     validate(fieldType, value) {
	//       return fieldType.pattern.test(value);
	//     }
	//     set model(model) {
	//       console.log("Initialized: ", data)
	//       var self = this;
	//       Object.keys(model).forEach(function (prop) {
	//           Object.defineProperty(self, prop, {
	//               // Create a new setter for the property
	//               set: function (value) {
	//                 const string = model[prop]
	//                   const fieldType = this.fieldTypes[string]
	//                   //console.log("Changed: ", model, prop, fieldType, this.validate(fieldType, value))
	//                   if(this.validate(fieldType, value)) {
	//                     data[prop] = value;
	//                   } else {
	//                     throw new Error('Fuck you!');
	//                   }
	//               },
	//               get: function () {
	//                 return data[prop];
	//               }
	//           })
	//       });
	//
	//     }
	//   }
	// return EasyModel
	// })();
	
	// class Book extends EasyModel {
	//   model = {
	//     title: 'text',
	//     pages: 'number'
	//   }
	//   read() {
	//     console.log('Reading...')
	//   }
	// }
	//
	// const book = new Book({
	//   title: 'Harry Potter'
	// });
	//
	// book.pages = 100;
	// book.read();
	
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.
	
	(function() {
	
	  // Baseline setup
	  // --------------
	
	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;
	
	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;
	
	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
	
	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;
	
	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;
	
	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};
	
	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };
	
	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }
	
	  // Current version.
	  _.VERSION = '1.8.3';
	
	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };
	
	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };
	
	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };
	
	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };
	
	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };
	
	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };
	
	  // Collection Functions
	  // --------------------
	
	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };
	
	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };
	
	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }
	
	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }
	
	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);
	
	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);
	
	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };
	
	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };
	
	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };
	
	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };
	
	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };
	
	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };
	
	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };
	
	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };
	
	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };
	
	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };
	
	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };
	
	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };
	
	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };
	
	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };
	
	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });
	
	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });
	
	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });
	
	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };
	
	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };
	
	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };
	
	  // Array Functions
	  // ---------------
	
	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };
	
	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };
	
	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };
	
	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };
	
	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };
	
	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };
	
	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };
	
	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };
	
	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };
	
	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };
	
	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };
	
	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };
	
	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };
	
	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);
	
	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };
	
	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };
	
	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }
	
	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);
	
	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };
	
	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }
	
	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
	
	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;
	
	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);
	
	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }
	
	    return range;
	  };
	
	  // Function (ahem) Functions
	  // ------------------
	
	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };
	
	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };
	
	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };
	
	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };
	
	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };
	
	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };
	
	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);
	
	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };
	
	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;
	
	    var later = function() {
	      var last = _.now() - timestamp;
	
	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };
	
	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }
	
	      return result;
	    };
	  };
	
	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };
	
	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };
	
	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };
	
	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };
	
	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };
	
	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);
	
	  // Object Functions
	  // ----------------
	
	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
	
	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;
	
	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
	
	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }
	
	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };
	
	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };
	
	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };
	
	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };
	
	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };
	
	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };
	
	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };
	
	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);
	
	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);
	
	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };
	
	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };
	
	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };
	
	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);
	
	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };
	
	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };
	
	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };
	
	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };
	
	
	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }
	
	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;
	
	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	
	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }
	
	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);
	
	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };
	
	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };
	
	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };
	
	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };
	
	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };
	
	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };
	
	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });
	
	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }
	
	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }
	
	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };
	
	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };
	
	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };
	
	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };
	
	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };
	
	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };
	
	  // Utility Functions
	  // -----------------
	
	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };
	
	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };
	
	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };
	
	  _.noop = function(){};
	
	  _.property = property;
	
	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };
	
	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };
	
	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };
	
	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };
	
	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };
	
	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);
	
	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);
	
	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };
	
	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };
	
	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };
	
	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;
	
	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };
	
	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
	
	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };
	
	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);
	
	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');
	
	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;
	
	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }
	
	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";
	
	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
	
	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';
	
	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }
	
	    var template = function(data) {
	      return render.call(this, data, _);
	    };
	
	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';
	
	    return template;
	  };
	
	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };
	
	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.
	
	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };
	
	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };
	
	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);
	
	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });
	
	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });
	
	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };
	
	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
	
	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };
	
	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define("easylogs", [], factory);
		else if(typeof exports === 'object')
			exports["easylogs"] = factory();
		else
			root["easylogs"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		var EasyLogs = function () {
		  function EasyLogs(level) {
		    _classCallCheck(this, EasyLogs);
		
		    // Logging levels:
		    this.LOG = {
		      INFO: 4,
		      DEBUG: 3,
		      WARN: 2,
		      ERROR: 1,
		      DISABLED: 0
		    };
		
		    this.setLevel(level);
		  }
		
		  _createClass(EasyLogs, [{
		    key: 'getLevel',
		    value: function getLevel() {
		      return this.level;
		    }
		  }, {
		    key: 'setLevel',
		    value: function setLevel() {
		      var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.LOG.INFO;
		
		      if (typeof level !== 'number') {
		        throw new Error('SetLevel method expected a Number as argument but got ' + (typeof level === 'undefined' ? 'undefined' : _typeof(level)) + ' instead');
		      }
		      this.level = level;
		    }
		  }, {
		    key: 'getConsole',
		    value: function getConsole(method) {
		      return console[method] ? console[method] : console.log;
		    }
		  }, {
		    key: 'shouldLog',
		    value: function shouldLog(logLevel) {
		      return this.level > 0 && this.level >= logLevel;
		    }
		  }, {
		    key: 'beautify',
		    value: function beautify(value) {
		      return JSON.stringify(value, null, 2);
		    }
		  }, {
		    key: 'info',
		    value: function info(message) {
		      if (this.shouldLog(this.LOG.INFO)) {
		        var _console = this.getConsole('info');
		        _console('INFO: ' + message);
		      }
		    }
		  }, {
		    key: 'debug',
		    value: function debug(message) {
		      if (this.shouldLog(this.LOG.DEBUG)) {
		        var _console2 = this.getConsole('log'); // Yeah, stupid AF, but for consistency...
		        _console2('DEBUG: ' + message);
		      }
		    }
		  }, {
		    key: 'warn',
		    value: function warn(message) {
		      if (this.shouldLog(this.LOG.WARN)) {
		        var _console3 = this.getConsole('warn');
		        _console3('WARNING: ' + message);
		      }
		    }
		  }, {
		    key: 'error',
		    value: function error(message) {
		      if (this.shouldLog(this.LOG.ERROR)) {
		        var _console4 = this.getConsole('error');
		        _console4('ERROR: ' + message);
		      }
		    }
		  }]);
		
		  return EasyLogs;
		}();
		
		exports.default = EasyLogs;
		module.exports = exports['default'];
	
	/***/ }
	/******/ ])
	});
	;
	//# sourceMappingURL=easylogs.js.map

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _underscore = __webpack_require__(1);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _easylogs = __webpack_require__(2);
	
	var _easylogs2 = _interopRequireDefault(_easylogs);
	
	__webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Types = function () {
	  var logger = new _easylogs2.default();
	
	  var allowedProps = ['type', 'pattern', 'length', 'required', 'validator'];
	
	  var self = {};
	
	  var GenericType = function GenericType() {
	    var _this = this;
	
	    var typeCustom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var userCustom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	    _classCallCheck(this, GenericType);
	
	    var userCustomIsObject = _underscore2.default.isObject(userCustom);
	    var typeCustomIsObject = _underscore2.default.isObject(typeCustom);
	
	    if (!userCustomIsObject || !typeCustomIsObject) {
	      typeCustom = typeCustomIsObject ? typeCustom : {};
	      userCustom = userCustomIsObject ? userCustom : {};
	
	      logger.error('The element used to generate a custom Type is not valid and it will be discarded. Please check your model');
	    }
	
	    var custom = Object.assign({}, typeCustom, userCustom);
	    (0, _underscore2.default)(custom).each(function (type, propName) {
	      if (allowedProps.includes(propName)) {
	        Object.defineProperty(_this, propName, {
	          // Define setter/getter for each propName in the model
	          set: function set(newValue) {
	            self[propName] = newValue;
	          },
	          get: function get() {
	            return self[propName];
	          }
	        });
	      } else {
	        logger.error(propName + ' is not a valid option, so it has been discarded. Please check your model');
	      }
	    });
	
	    // Type
	    // this.type = custom.type;
	    //
	    // // Validation
	    // this.pattern = custom.pattern || /.*/g;
	    // this.required = custom.required || false;
	    // this.length = custom.length;
	    // this.validator = custom.validator;
	  };
	
	  var TextType = function (_GenericType) {
	    _inherits(TextType, _GenericType);
	
	    function TextType() {
	      var userCustom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	      _classCallCheck(this, TextType);
	
	      var typeCustom = {
	        type: 'text'
	      };
	
	      return _possibleConstructorReturn(this, (TextType.__proto__ || Object.getPrototypeOf(TextType)).call(this, typeCustom, userCustom));
	    }
	
	    return TextType;
	  }(GenericType);
	
	  var NumberType = function (_GenericType2) {
	    _inherits(NumberType, _GenericType2);
	
	    function NumberType(userCustom) {
	      _classCallCheck(this, NumberType);
	
	      var typeCustom = {
	        type: 'number',
	        validator: /^\d+$/
	      };
	
	      return _possibleConstructorReturn(this, (NumberType.__proto__ || Object.getPrototypeOf(NumberType)).call(this, typeCustom, userCustom));
	    }
	
	    return NumberType;
	  }(GenericType);
	
	  return {
	    TextType: TextType,
	    NumberType: NumberType
	  };
	}();
	
	exports.default = {
	  Text: Types.TextType,
	  Number: Types.NumberType
	};
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {// Copyright (C) 2011-2012 Software Languages Lab, Vrije Universiteit Brussel
	// This code is dual-licensed under both the Apache License and the MPL
	
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	// http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	
	/* Version: MPL 1.1
	 *
	 * The contents of this file are subject to the Mozilla Public License Version
	 * 1.1 (the "License"); you may not use this file except in compliance with
	 * the License. You may obtain a copy of the License at
	 * http://www.mozilla.org/MPL/
	 *
	 * Software distributed under the License is distributed on an "AS IS" basis,
	 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
	 * for the specific language governing rights and limitations under the
	 * License.
	 *
	 * The Original Code is a shim for the ES-Harmony reflection module
	 *
	 * The Initial Developer of the Original Code is
	 * Tom Van Cutsem, Vrije Universiteit Brussel.
	 * Portions created by the Initial Developer are Copyright (C) 2011-2012
	 * the Initial Developer. All Rights Reserved.
	 *
	 * Contributor(s):
	 *
	 */
	
	 // ----------------------------------------------------------------------------
	
	 // This file is a polyfill for the upcoming ECMAScript Reflect API,
	 // including support for Proxies. See the draft specification at:
	 // http://wiki.ecmascript.org/doku.php?id=harmony:reflect_api
	 // http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies
	
	 // For an implementation of the Handler API, see handlers.js, which implements:
	 // http://wiki.ecmascript.org/doku.php?id=harmony:virtual_object_api
	
	 // This implementation supersedes the earlier polyfill at:
	 // code.google.com/p/es-lab/source/browse/trunk/src/proxies/DirectProxies.js
	
	 // This code was tested on tracemonkey / Firefox 12
	//  (and should run fine on older Firefox versions starting with FF4)
	 // The code also works correctly on
	 //   v8 --harmony_proxies --harmony_weakmaps (v3.6.5.1)
	
	 // Language Dependencies:
	 //  - ECMAScript 5/strict
	 //  - "old" (i.e. non-direct) Harmony Proxies
	 //  - Harmony WeakMaps
	 // Patches:
	 //  - Object.{freeze,seal,preventExtensions}
	 //  - Object.{isFrozen,isSealed,isExtensible}
	 //  - Object.getPrototypeOf
	 //  - Object.keys
	 //  - Object.prototype.valueOf
	 //  - Object.prototype.isPrototypeOf
	 //  - Object.prototype.toString
	 //  - Object.prototype.hasOwnProperty
	 //  - Object.getOwnPropertyDescriptor
	 //  - Object.defineProperty
	 //  - Object.defineProperties
	 //  - Object.getOwnPropertyNames
	 //  - Object.getOwnPropertySymbols
	 //  - Object.getPrototypeOf
	 //  - Object.setPrototypeOf
	 //  - Object.assign
	 //  - Function.prototype.toString
	 //  - Date.prototype.toString
	 //  - Array.isArray
	 //  - Array.prototype.concat
	 //  - Proxy
	 // Adds new globals:
	 //  - Reflect
	
	 // Direct proxies can be created via Proxy(target, handler)
	
	 // ----------------------------------------------------------------------------
	
	(function(global){ // function-as-module pattern
	"use strict";
	
	// === Direct Proxies: Invariant Enforcement ===
	
	// Direct proxies build on non-direct proxies by automatically wrapping
	// all user-defined proxy handlers in a Validator handler that checks and
	// enforces ES5 invariants.
	
	// A direct proxy is a proxy for an existing object called the target object.
	
	// A Validator handler is a wrapper for a target proxy handler H.
	// The Validator forwards all operations to H, but additionally
	// performs a number of integrity checks on the results of some traps,
	// to make sure H does not violate the ES5 invariants w.r.t. non-configurable
	// properties and non-extensible, sealed or frozen objects.
	
	// For each property that H exposes as own, non-configurable
	// (e.g. by returning a descriptor from a call to getOwnPropertyDescriptor)
	// the Validator handler defines those properties on the target object.
	// When the proxy becomes non-extensible, also configurable own properties
	// are checked against the target.
	// We will call properties that are defined on the target object
	// "fixed properties".
	
	// We will name fixed non-configurable properties "sealed properties".
	// We will name fixed non-configurable non-writable properties "frozen
	// properties".
	
	// The Validator handler upholds the following invariants w.r.t. non-configurability:
	// - getOwnPropertyDescriptor cannot report sealed properties as non-existent
	// - getOwnPropertyDescriptor cannot report incompatible changes to the
	//   attributes of a sealed property (e.g. reporting a non-configurable
	//   property as configurable, or reporting a non-configurable, non-writable
	//   property as writable)
	// - getPropertyDescriptor cannot report sealed properties as non-existent
	// - getPropertyDescriptor cannot report incompatible changes to the
	//   attributes of a sealed property. It _can_ report incompatible changes
	//   to the attributes of non-own, inherited properties.
	// - defineProperty cannot make incompatible changes to the attributes of
	//   sealed properties
	// - deleteProperty cannot report a successful deletion of a sealed property
	// - hasOwn cannot report a sealed property as non-existent
	// - has cannot report a sealed property as non-existent
	// - get cannot report inconsistent values for frozen data
	//   properties, and must report undefined for sealed accessors with an
	//   undefined getter
	// - set cannot report a successful assignment for frozen data
	//   properties or sealed accessors with an undefined setter.
	// - get{Own}PropertyNames lists all sealed properties of the target.
	// - keys lists all enumerable sealed properties of the target.
	// - enumerate lists all enumerable sealed properties of the target.
	// - if a property of a non-extensible proxy is reported as non-existent,
	//   then it must forever be reported as non-existent. This applies to
	//   own and inherited properties and is enforced in the
	//   deleteProperty, get{Own}PropertyDescriptor, has{Own},
	//   get{Own}PropertyNames, keys and enumerate traps
	
	// Violation of any of these invariants by H will result in TypeError being
	// thrown.
	
	// Additionally, once Object.preventExtensions, Object.seal or Object.freeze
	// is invoked on the proxy, the set of own property names for the proxy is
	// fixed. Any property name that is not fixed is called a 'new' property.
	
	// The Validator upholds the following invariants regarding extensibility:
	// - getOwnPropertyDescriptor cannot report new properties as existent
	//   (it must report them as non-existent by returning undefined)
	// - defineProperty cannot successfully add a new property (it must reject)
	// - getOwnPropertyNames cannot list new properties
	// - hasOwn cannot report true for new properties (it must report false)
	// - keys cannot list new properties
	
	// Invariants currently not enforced:
	// - getOwnPropertyNames lists only own property names
	// - keys lists only enumerable own property names
	// Both traps may list more property names than are actually defined on the
	// target.
	
	// Invariants with regard to inheritance are currently not enforced.
	// - a non-configurable potentially inherited property on a proxy with
	//   non-mutable ancestry cannot be reported as non-existent
	// (An object with non-mutable ancestry is a non-extensible object whose
	// [[Prototype]] is either null or an object with non-mutable ancestry.)
	
	// Changes in Handler API compared to previous harmony:proxies, see:
	// http://wiki.ecmascript.org/doku.php?id=strawman:direct_proxies
	// http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies
	
	// ----------------------------------------------------------------------------
	
	// ---- WeakMap polyfill ----
	
	// TODO: find a proper WeakMap polyfill
	
	// define an empty WeakMap so that at least the Reflect module code
	// will work in the absence of WeakMaps. Proxy emulation depends on
	// actual WeakMaps, so will not work with this little shim.
	if (typeof WeakMap === "undefined") {
	  global.WeakMap = function(){};
	  global.WeakMap.prototype = {
	    get: function(k) { return undefined; },
	    set: function(k,v) { throw new Error("WeakMap not supported"); }
	  };
	}
	
	// ---- Normalization functions for property descriptors ----
	
	function isStandardAttribute(name) {
	  return /^(get|set|value|writable|enumerable|configurable)$/.test(name);
	}
	
	// Adapted from ES5 section 8.10.5
	function toPropertyDescriptor(obj) {
	  if (Object(obj) !== obj) {
	    throw new TypeError("property descriptor should be an Object, given: "+
	                        obj);
	  }
	  var desc = {};
	  if ('enumerable' in obj) { desc.enumerable = !!obj.enumerable; }
	  if ('configurable' in obj) { desc.configurable = !!obj.configurable; }
	  if ('value' in obj) { desc.value = obj.value; }
	  if ('writable' in obj) { desc.writable = !!obj.writable; }
	  if ('get' in obj) {
	    var getter = obj.get;
	    if (getter !== undefined && typeof getter !== "function") {
	      throw new TypeError("property descriptor 'get' attribute must be "+
	                          "callable or undefined, given: "+getter);
	    }
	    desc.get = getter;
	  }
	  if ('set' in obj) {
	    var setter = obj.set;
	    if (setter !== undefined && typeof setter !== "function") {
	      throw new TypeError("property descriptor 'set' attribute must be "+
	                          "callable or undefined, given: "+setter);
	    }
	    desc.set = setter;
	  }
	  if ('get' in desc || 'set' in desc) {
	    if ('value' in desc || 'writable' in desc) {
	      throw new TypeError("property descriptor cannot be both a data and an "+
	                          "accessor descriptor: "+obj);
	    }
	  }
	  return desc;
	}
	
	function isAccessorDescriptor(desc) {
	  if (desc === undefined) return false;
	  return ('get' in desc || 'set' in desc);
	}
	function isDataDescriptor(desc) {
	  if (desc === undefined) return false;
	  return ('value' in desc || 'writable' in desc);
	}
	function isGenericDescriptor(desc) {
	  if (desc === undefined) return false;
	  return !isAccessorDescriptor(desc) && !isDataDescriptor(desc);
	}
	
	function toCompletePropertyDescriptor(desc) {
	  var internalDesc = toPropertyDescriptor(desc);
	  if (isGenericDescriptor(internalDesc) || isDataDescriptor(internalDesc)) {
	    if (!('value' in internalDesc)) { internalDesc.value = undefined; }
	    if (!('writable' in internalDesc)) { internalDesc.writable = false; }
	  } else {
	    if (!('get' in internalDesc)) { internalDesc.get = undefined; }
	    if (!('set' in internalDesc)) { internalDesc.set = undefined; }
	  }
	  if (!('enumerable' in internalDesc)) { internalDesc.enumerable = false; }
	  if (!('configurable' in internalDesc)) { internalDesc.configurable = false; }
	  return internalDesc;
	}
	
	function isEmptyDescriptor(desc) {
	  return !('get' in desc) &&
	         !('set' in desc) &&
	         !('value' in desc) &&
	         !('writable' in desc) &&
	         !('enumerable' in desc) &&
	         !('configurable' in desc);
	}
	
	function isEquivalentDescriptor(desc1, desc2) {
	  return sameValue(desc1.get, desc2.get) &&
	         sameValue(desc1.set, desc2.set) &&
	         sameValue(desc1.value, desc2.value) &&
	         sameValue(desc1.writable, desc2.writable) &&
	         sameValue(desc1.enumerable, desc2.enumerable) &&
	         sameValue(desc1.configurable, desc2.configurable);
	}
	
	// copied from http://wiki.ecmascript.org/doku.php?id=harmony:egal
	function sameValue(x, y) {
	  if (x === y) {
	    // 0 === -0, but they are not identical
	    return x !== 0 || 1 / x === 1 / y;
	  }
	
	  // NaN !== NaN, but they are identical.
	  // NaNs are the only non-reflexive value, i.e., if x !== x,
	  // then x is a NaN.
	  // isNaN is broken: it converts its argument to number, so
	  // isNaN("foo") => true
	  return x !== x && y !== y;
	}
	
	/**
	 * Returns a fresh property descriptor that is guaranteed
	 * to be complete (i.e. contain all the standard attributes).
	 * Additionally, any non-standard enumerable properties of
	 * attributes are copied over to the fresh descriptor.
	 *
	 * If attributes is undefined, returns undefined.
	 *
	 * See also: http://wiki.ecmascript.org/doku.php?id=harmony:proxies_semantics
	 */
	function normalizeAndCompletePropertyDescriptor(attributes) {
	  if (attributes === undefined) { return undefined; }
	  var desc = toCompletePropertyDescriptor(attributes);
	  // Note: no need to call FromPropertyDescriptor(desc), as we represent
	  // "internal" property descriptors as proper Objects from the start
	  for (var name in attributes) {
	    if (!isStandardAttribute(name)) {
	      Object.defineProperty(desc, name,
	        { value: attributes[name],
	          writable: true,
	          enumerable: true,
	          configurable: true });
	    }
	  }
	  return desc;
	}
	
	/**
	 * Returns a fresh property descriptor whose standard
	 * attributes are guaranteed to be data properties of the right type.
	 * Additionally, any non-standard enumerable properties of
	 * attributes are copied over to the fresh descriptor.
	 *
	 * If attributes is undefined, will throw a TypeError.
	 *
	 * See also: http://wiki.ecmascript.org/doku.php?id=harmony:proxies_semantics
	 */
	function normalizePropertyDescriptor(attributes) {
	  var desc = toPropertyDescriptor(attributes);
	  // Note: no need to call FromGenericPropertyDescriptor(desc), as we represent
	  // "internal" property descriptors as proper Objects from the start
	  for (var name in attributes) {
	    if (!isStandardAttribute(name)) {
	      Object.defineProperty(desc, name,
	        { value: attributes[name],
	          writable: true,
	          enumerable: true,
	          configurable: true });
	    }
	  }
	  return desc;
	}
	
	// store a reference to the real ES5 primitives before patching them later
	var prim_preventExtensions =        Object.preventExtensions,
	    prim_seal =                     Object.seal,
	    prim_freeze =                   Object.freeze,
	    prim_isExtensible =             Object.isExtensible,
	    prim_isSealed =                 Object.isSealed,
	    prim_isFrozen =                 Object.isFrozen,
	    prim_getPrototypeOf =           Object.getPrototypeOf,
	    prim_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
	    prim_defineProperty =           Object.defineProperty,
	    prim_defineProperties =         Object.defineProperties,
	    prim_keys =                     Object.keys,
	    prim_getOwnPropertyNames =      Object.getOwnPropertyNames,
	    prim_getOwnPropertySymbols =    Object.getOwnPropertySymbols,
	    prim_assign =                   Object.assign,
	    prim_isArray =                  Array.isArray,
	    prim_concat =                   Array.prototype.concat,
	    prim_isPrototypeOf =            Object.prototype.isPrototypeOf,
	    prim_hasOwnProperty =           Object.prototype.hasOwnProperty;
	
	// these will point to the patched versions of the respective methods on
	// Object. They are used within this module as the "intrinsic" bindings
	// of these methods (i.e. the "original" bindings as defined in the spec)
	var Object_isFrozen,
	    Object_isSealed,
	    Object_isExtensible,
	    Object_getPrototypeOf,
	    Object_getOwnPropertyNames;
	
	/**
	 * A property 'name' is fixed if it is an own property of the target.
	 */
	function isFixed(name, target) {
	  return ({}).hasOwnProperty.call(target, name);
	}
	function isSealed(name, target) {
	  var desc = Object.getOwnPropertyDescriptor(target, name);
	  if (desc === undefined) { return false; }
	  return desc.configurable === false;
	}
	function isSealedDesc(desc) {
	  return desc !== undefined && desc.configurable === false;
	}
	
	/**
	 * Performs all validation that Object.defineProperty performs,
	 * without actually defining the property. Returns a boolean
	 * indicating whether validation succeeded.
	 *
	 * Implementation transliterated from ES5.1 section 8.12.9
	 */
	function isCompatibleDescriptor(extensible, current, desc) {
	  if (current === undefined && extensible === false) {
	    return false;
	  }
	  if (current === undefined && extensible === true) {
	    return true;
	  }
	  if (isEmptyDescriptor(desc)) {
	    return true;
	  }
	  if (isEquivalentDescriptor(current, desc)) {
	    return true;
	  }
	  if (current.configurable === false) {
	    if (desc.configurable === true) {
	      return false;
	    }
	    if ('enumerable' in desc && desc.enumerable !== current.enumerable) {
	      return false;
	    }
	  }
	  if (isGenericDescriptor(desc)) {
	    return true;
	  }
	  if (isDataDescriptor(current) !== isDataDescriptor(desc)) {
	    if (current.configurable === false) {
	      return false;
	    }
	    return true;
	  }
	  if (isDataDescriptor(current) && isDataDescriptor(desc)) {
	    if (current.configurable === false) {
	      if (current.writable === false && desc.writable === true) {
	        return false;
	      }
	      if (current.writable === false) {
	        if ('value' in desc && !sameValue(desc.value, current.value)) {
	          return false;
	        }
	      }
	    }
	    return true;
	  }
	  if (isAccessorDescriptor(current) && isAccessorDescriptor(desc)) {
	    if (current.configurable === false) {
	      if ('set' in desc && !sameValue(desc.set, current.set)) {
	        return false;
	      }
	      if ('get' in desc && !sameValue(desc.get, current.get)) {
	        return false;
	      }
	    }
	  }
	  return true;
	}
	
	// ES6 7.3.11 SetIntegrityLevel
	// level is one of "sealed" or "frozen"
	function setIntegrityLevel(target, level) {
	  var ownProps = Object_getOwnPropertyNames(target);
	  var pendingException = undefined;
	  if (level === "sealed") {
	    var l = +ownProps.length;
	    var k;
	    for (var i = 0; i < l; i++) {
	      k = String(ownProps[i]);
	      try {
	        Object.defineProperty(target, k, { configurable: false });
	      } catch (e) {
	        if (pendingException === undefined) {
	          pendingException = e;
	        }
	      }
	    }
	  } else {
	    // level === "frozen"
	    var l = +ownProps.length;
	    var k;
	    for (var i = 0; i < l; i++) {
	      k = String(ownProps[i]);
	      try {
	        var currentDesc = Object.getOwnPropertyDescriptor(target, k);
	        if (currentDesc !== undefined) {
	          var desc;
	          if (isAccessorDescriptor(currentDesc)) {
	            desc = { configurable: false }
	          } else {
	            desc = { configurable: false, writable: false }
	          }
	          Object.defineProperty(target, k, desc);
	        }        
	      } catch (e) {
	        if (pendingException === undefined) {
	          pendingException = e;
	        }
	      }
	    }
	  }
	  if (pendingException !== undefined) {
	    throw pendingException;
	  }
	  return Reflect.preventExtensions(target);
	}
	
	// ES6 7.3.12 TestIntegrityLevel
	// level is one of "sealed" or "frozen"
	function testIntegrityLevel(target, level) {
	  var isExtensible = Object_isExtensible(target);
	  if (isExtensible) return false;
	  
	  var ownProps = Object_getOwnPropertyNames(target);
	  var pendingException = undefined;
	  var configurable = false;
	  var writable = false;
	  
	  var l = +ownProps.length;
	  var k;
	  var currentDesc;
	  for (var i = 0; i < l; i++) {
	    k = String(ownProps[i]);
	    try {
	      currentDesc = Object.getOwnPropertyDescriptor(target, k);
	      configurable = configurable || currentDesc.configurable;
	      if (isDataDescriptor(currentDesc)) {
	        writable = writable || currentDesc.writable;
	      }
	    } catch (e) {
	      if (pendingException === undefined) {
	        pendingException = e;
	        configurable = true;
	      }
	    }
	  }
	  if (pendingException !== undefined) {
	    throw pendingException;
	  }
	  if (level === "frozen" && writable === true) {
	    return false;
	  }
	  if (configurable === true) {
	    return false;
	  }
	  return true;
	}
	
	// ---- The Validator handler wrapper around user handlers ----
	
	/**
	 * @param target the object wrapped by this proxy.
	 * As long as the proxy is extensible, only non-configurable properties
	 * are checked against the target. Once the proxy becomes non-extensible,
	 * invariants w.r.t. non-extensibility are also enforced.
	 *
	 * @param handler the handler of the direct proxy. The object emulated by
	 * this handler is validated against the target object of the direct proxy.
	 * Any violations that the handler makes against the invariants
	 * of the target will cause a TypeError to be thrown.
	 *
	 * Both target and handler must be proper Objects at initialization time.
	 */
	function Validator(target, handler) {
	  // for non-revokable proxies, these are const references
	  // for revokable proxies, on revocation:
	  // - this.target is set to null
	  // - this.handler is set to a handler that throws on all traps
	  this.target  = target;
	  this.handler = handler;
	}
	
	Validator.prototype = {
	
	  /**
	   * If getTrap returns undefined, the caller should perform the
	   * default forwarding behavior.
	   * If getTrap returns normally otherwise, the return value
	   * will be a callable trap function. When calling the trap function,
	   * the caller is responsible for binding its |this| to |this.handler|.
	   */
	  getTrap: function(trapName) {
	    var trap = this.handler[trapName];
	    if (trap === undefined) {
	      // the trap was not defined,
	      // perform the default forwarding behavior
	      return undefined;
	    }
	
	    if (typeof trap !== "function") {
	      throw new TypeError(trapName + " trap is not callable: "+trap);
	    }
	
	    return trap;
	  },
	
	  // === fundamental traps ===
	
	  /**
	   * If name denotes a fixed property, check:
	   *   - whether targetHandler reports it as existent
	   *   - whether the returned descriptor is compatible with the fixed property
	   * If the proxy is non-extensible, check:
	   *   - whether name is not a new property
	   * Additionally, the returned descriptor is normalized and completed.
	   */
	  getOwnPropertyDescriptor: function(name) {
	    "use strict";
	
	    var trap = this.getTrap("getOwnPropertyDescriptor");
	    if (trap === undefined) {
	      return Reflect.getOwnPropertyDescriptor(this.target, name);
	    }
	
	    name = String(name);
	    var desc = trap.call(this.handler, this.target, name);
	    desc = normalizeAndCompletePropertyDescriptor(desc);
	
	    var targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
	    var extensible = Object.isExtensible(this.target);
	
	    if (desc === undefined) {
	      if (isSealedDesc(targetDesc)) {
	        throw new TypeError("cannot report non-configurable property '"+name+
	                            "' as non-existent");
	      }
	      if (!extensible && targetDesc !== undefined) {
	          // if handler is allowed to return undefined, we cannot guarantee
	          // that it will not return a descriptor for this property later.
	          // Once a property has been reported as non-existent on a non-extensible
	          // object, it should forever be reported as non-existent
	          throw new TypeError("cannot report existing own property '"+name+
	                              "' as non-existent on a non-extensible object");
	      }
	      return undefined;
	    }
	
	    // at this point, we know (desc !== undefined), i.e.
	    // targetHandler reports 'name' as an existing property
	
	    // Note: we could collapse the following two if-tests into a single
	    // test. Separating out the cases to improve error reporting.
	
	    if (!extensible) {
	      if (targetDesc === undefined) {
	        throw new TypeError("cannot report a new own property '"+
	                            name + "' on a non-extensible object");
	      }
	    }
	
	    if (name !== undefined) {
	      if (!isCompatibleDescriptor(extensible, targetDesc, desc)) {
	        throw new TypeError("cannot report incompatible property descriptor "+
	                            "for property '"+name+"'");
	      }
	    }
	    
	    if (desc.configurable === false) {
	      if (targetDesc === undefined || targetDesc.configurable === true) {
	        // if the property is configurable or non-existent on the target,
	        // but is reported as a non-configurable property, it may later be
	        // reported as configurable or non-existent, which violates the
	        // invariant that if the property might change or disappear, the
	        // configurable attribute must be true.
	        throw new TypeError(
	          "cannot report a non-configurable descriptor " +
	          "for configurable or non-existent property '" + name + "'");
	      }
	      if ('writable' in desc && desc.writable === false) {
	        if (targetDesc.writable === true) {
	          // if the property is non-configurable, writable on the target,
	          // but is reported as non-configurable, non-writable, it may later
	          // be reported as non-configurable, writable again, which violates
	          // the invariant that a non-configurable, non-writable property
	          // may not change state.
	          throw new TypeError(
	            "cannot report non-configurable, writable property '" + name +
	            "' as non-configurable, non-writable");
	        }
	      }
	    }
	
	    return desc;
	  },
	
	  /**
	   * In the direct proxies design with refactored prototype climbing,
	   * this trap is deprecated. For proxies-as-prototypes, instead
	   * of calling this trap, the get, set, has or enumerate traps are
	   * called instead.
	   *
	   * In this implementation, we "abuse" getPropertyDescriptor to
	   * support trapping the get or set traps for proxies-as-prototypes.
	   * We do this by returning a getter/setter pair that invokes
	   * the corresponding traps.
	   *
	   * While this hack works for inherited property access, it has some
	   * quirks:
	   *
	   * In Firefox, this trap is only called after a prior invocation
	   * of the 'has' trap has returned true. Hence, expect the following
	   * behavior:
	   * <code>
	   * var child = Object.create(Proxy(target, handler));
	   * child[name] // triggers handler.has(target, name)
	   * // if that returns true, triggers handler.get(target, name, child)
	   * </code>
	   *
	   * On v8, the 'in' operator, when applied to an object that inherits
	   * from a proxy, will call getPropertyDescriptor and walk the proto-chain.
	   * That calls the below getPropertyDescriptor trap on the proxy. The
	   * result of the 'in'-operator is then determined by whether this trap
	   * returns undefined or a property descriptor object. That is why
	   * we first explicitly trigger the 'has' trap to determine whether
	   * the property exists.
	   *
	   * This has the side-effect that when enumerating properties on
	   * an object that inherits from a proxy in v8, only properties
	   * for which 'has' returns true are returned:
	   *
	   * <code>
	   * var child = Object.create(Proxy(target, handler));
	   * for (var prop in child) {
	   *   // only enumerates prop if (prop in child) returns true
	   * }
	   * </code>
	   */
	  getPropertyDescriptor: function(name) {
	    var handler = this;
	
	    if (!handler.has(name)) return undefined;
	
	    return {
	      get: function() {
	        return handler.get(this, name);
	      },
	      set: function(val) {
	        if (handler.set(this, name, val)) {
	          return val;
	        } else {
	          throw new TypeError("failed assignment to "+name);
	        }
	      },
	      enumerable: true,
	      configurable: true
	    };
	  },
	
	  /**
	   * If name denotes a fixed property, check for incompatible changes.
	   * If the proxy is non-extensible, check that new properties are rejected.
	   */
	  defineProperty: function(name, desc) {
	    // TODO(tvcutsem): the current tracemonkey implementation of proxies
	    // auto-completes 'desc', which is not correct. 'desc' should be
	    // normalized, but not completed. Consider:
	    // Object.defineProperty(proxy, 'foo', {enumerable:false})
	    // This trap will receive desc =
	    //  {value:undefined,writable:false,enumerable:false,configurable:false}
	    // This will also set all other attributes to their default value,
	    // which is unexpected and different from [[DefineOwnProperty]].
	    // Bug filed: https://bugzilla.mozilla.org/show_bug.cgi?id=601329
	
	    var trap = this.getTrap("defineProperty");
	    if (trap === undefined) {
	      // default forwarding behavior
	      return Reflect.defineProperty(this.target, name, desc);
	    }
	
	    name = String(name);
	    var descObj = normalizePropertyDescriptor(desc);
	    var success = trap.call(this.handler, this.target, name, descObj);
	    success = !!success; // coerce to Boolean
	
	    if (success === true) {
	
	      var targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
	      var extensible = Object.isExtensible(this.target);
	
	      // Note: we could collapse the following two if-tests into a single
	      // test. Separating out the cases to improve error reporting.
	
	      if (!extensible) {
	        if (targetDesc === undefined) {
	          throw new TypeError("cannot successfully add a new property '"+
	                              name + "' to a non-extensible object");
	        }
	      }
	
	      if (targetDesc !== undefined) {
	        if (!isCompatibleDescriptor(extensible, targetDesc, desc)) {
	          throw new TypeError("cannot define incompatible property "+
	                              "descriptor for property '"+name+"'");
	        }
	        if (isDataDescriptor(targetDesc) &&
	            targetDesc.configurable === false &&
	            targetDesc.writable === true) {
	            if (desc.configurable === false && desc.writable === false) {
	              // if the property is non-configurable, writable on the target
	              // but was successfully reported to be updated to
	              // non-configurable, non-writable, it can later be reported
	              // again as non-configurable, writable, which violates
	              // the invariant that non-configurable, non-writable properties
	              // cannot change state
	              throw new TypeError(
	                "cannot successfully define non-configurable, writable " +
	                " property '" + name + "' as non-configurable, non-writable");
	            }
	          }
	      }
	
	      if (desc.configurable === false && !isSealedDesc(targetDesc)) {
	        // if the property is configurable or non-existent on the target,
	        // but is successfully being redefined as a non-configurable property,
	        // it may later be reported as configurable or non-existent, which violates
	        // the invariant that if the property might change or disappear, the
	        // configurable attribute must be true.
	        throw new TypeError(
	          "cannot successfully define a non-configurable " +
	          "descriptor for configurable or non-existent property '" +
	          name + "'");
	      }
	
	    }
	
	    return success;
	  },
	
	  /**
	   * On success, check whether the target object is indeed non-extensible.
	   */
	  preventExtensions: function() {
	    var trap = this.getTrap("preventExtensions");
	    if (trap === undefined) {
	      // default forwarding behavior
	      return Reflect.preventExtensions(this.target);
	    }
	
	    var success = trap.call(this.handler, this.target);
	    success = !!success; // coerce to Boolean
	    if (success) {
	      if (Object_isExtensible(this.target)) {
	        throw new TypeError("can't report extensible object as non-extensible: "+
	                            this.target);
	      }
	    }
	    return success;
	  },
	
	  /**
	   * If name denotes a sealed property, check whether handler rejects.
	   */
	  delete: function(name) {
	    "use strict";
	    var trap = this.getTrap("deleteProperty");
	    if (trap === undefined) {
	      // default forwarding behavior
	      return Reflect.deleteProperty(this.target, name);
	    }
	
	    name = String(name);
	    var res = trap.call(this.handler, this.target, name);
	    res = !!res; // coerce to Boolean
	
	    var targetDesc;
	    if (res === true) {
	      targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
	      if (targetDesc !== undefined && targetDesc.configurable === false) {
	        throw new TypeError("property '" + name + "' is non-configurable "+
	                            "and can't be deleted");
	      }
	      if (targetDesc !== undefined && !Object_isExtensible(this.target)) {
	        // if the property still exists on a non-extensible target but
	        // is reported as successfully deleted, it may later be reported
	        // as present, which violates the invariant that an own property,
	        // deleted from a non-extensible object cannot reappear.
	        throw new TypeError(
	          "cannot successfully delete existing property '" + name +
	          "' on a non-extensible object");
	      }
	    }
	
	    return res;
	  },
	
	  /**
	   * The getOwnPropertyNames trap was replaced by the ownKeys trap,
	   * which now also returns an array (of strings or symbols) and
	   * which performs the same rigorous invariant checks as getOwnPropertyNames
	   *
	   * See issue #48 on how this trap can still get invoked by external libs
	   * that don't use the patched Object.getOwnPropertyNames function.
	   */
	  getOwnPropertyNames: function() {
	    // Note: removed deprecation warning to avoid dependency on 'console'
	    // (and on node, should anyway use util.deprecate). Deprecation warnings
	    // can also be annoying when they are outside of the user's control, e.g.
	    // when an external library calls unpatched Object.getOwnPropertyNames.
	    // Since there is a clean fallback to `ownKeys`, the fact that the
	    // deprecated method is still called is mostly harmless anyway.
	    // See also issues #65 and #66.
	    // console.warn("getOwnPropertyNames trap is deprecated. Use ownKeys instead");
	    return this.ownKeys();
	  },
	
	  /**
	   * Checks whether the trap result does not contain any new properties
	   * if the proxy is non-extensible.
	   *
	   * Any own non-configurable properties of the target that are not included
	   * in the trap result give rise to a TypeError. As such, we check whether the
	   * returned result contains at least all sealed properties of the target
	   * object.
	   *
	   * Additionally, the trap result is normalized.
	   * Instead of returning the trap result directly:
	   *  - create and return a fresh Array,
	   *  - of which each element is coerced to a String
	   *
	   * This trap is called a.o. by Reflect.ownKeys, Object.getOwnPropertyNames
	   * and Object.keys (the latter filters out only the enumerable own properties).
	   */
	  ownKeys: function() {
	    var trap = this.getTrap("ownKeys");
	    if (trap === undefined) {
	      // default forwarding behavior
	      return Reflect.ownKeys(this.target);
	    }
	
	    var trapResult = trap.call(this.handler, this.target);
	
	    // propNames is used as a set of strings
	    var propNames = Object.create(null);
	    var numProps = +trapResult.length;
	    var result = new Array(numProps);
	
	    for (var i = 0; i < numProps; i++) {
	      var s = String(trapResult[i]);
	      if (!Object.isExtensible(this.target) && !isFixed(s, this.target)) {
	        // non-extensible proxies don't tolerate new own property names
	        throw new TypeError("ownKeys trap cannot list a new "+
	                            "property '"+s+"' on a non-extensible object");
	      }
	
	      propNames[s] = true;
	      result[i] = s;
	    }
	
	    var ownProps = Object_getOwnPropertyNames(this.target);
	    var target = this.target;
	    ownProps.forEach(function (ownProp) {
	      if (!propNames[ownProp]) {
	        if (isSealed(ownProp, target)) {
	          throw new TypeError("ownKeys trap failed to include "+
	                              "non-configurable property '"+ownProp+"'");
	        }
	        if (!Object.isExtensible(target) &&
	            isFixed(ownProp, target)) {
	            // if handler is allowed to report ownProp as non-existent,
	            // we cannot guarantee that it will never later report it as
	            // existent. Once a property has been reported as non-existent
	            // on a non-extensible object, it should forever be reported as
	            // non-existent
	            throw new TypeError("ownKeys trap cannot report existing own property '"+
	                                ownProp+"' as non-existent on a non-extensible object");
	        }
	      }
	    });
	
	    return result;
	  },
	
	  /**
	   * Checks whether the trap result is consistent with the state of the
	   * wrapped target.
	   */
	  isExtensible: function() {
	    var trap = this.getTrap("isExtensible");
	    if (trap === undefined) {
	      // default forwarding behavior
	      return Reflect.isExtensible(this.target);
	    }
	
	    var result = trap.call(this.handler, this.target);
	    result = !!result; // coerce to Boolean
	    var state = Object_isExtensible(this.target);
	    if (result !== state) {
	      if (result) {
	        throw new TypeError("cannot report non-extensible object as extensible: "+
	                             this.target);
	      } else {
	        throw new TypeError("cannot report extensible object as non-extensible: "+
	                             this.target);
	      }
	    }
	    return state;
	  },
	
	  /**
	   * Check whether the trap result corresponds to the target's [[Prototype]]
	   */
	  getPrototypeOf: function() {
	    var trap = this.getTrap("getPrototypeOf");
	    if (trap === undefined) {
	      // default forwarding behavior
	      return Reflect.getPrototypeOf(this.target);
	    }
	
	    var allegedProto = trap.call(this.handler, this.target);
	
	    if (!Object_isExtensible(this.target)) {
	      var actualProto = Object_getPrototypeOf(this.target);
	      if (!sameValue(allegedProto, actualProto)) {
	        throw new TypeError("prototype value does not match: " + this.target);
	      }
	    }
	
	    return allegedProto;
	  },
	
	  /**
	   * If target is non-extensible and setPrototypeOf trap returns true,
	   * check whether the trap result corresponds to the target's [[Prototype]]
	   */
	  setPrototypeOf: function(newProto) {
	    var trap = this.getTrap("setPrototypeOf");
	    if (trap === undefined) {
	      // default forwarding behavior
	      return Reflect.setPrototypeOf(this.target, newProto);
	    }
	
	    var success = trap.call(this.handler, this.target, newProto);
	
	    success = !!success;
	    if (success && !Object_isExtensible(this.target)) {
	      var actualProto = Object_getPrototypeOf(this.target);
	      if (!sameValue(newProto, actualProto)) {
	        throw new TypeError("prototype value does not match: " + this.target);
	      }
	    }
	
	    return success;
	  },
	
	  /**
	   * In the direct proxies design with refactored prototype climbing,
	   * this trap is deprecated. For proxies-as-prototypes, for-in will
	   * call the enumerate() trap. If that trap is not defined, the
	   * operation is forwarded to the target, no more fallback on this
	   * fundamental trap.
	   */
	  getPropertyNames: function() {
	    throw new TypeError("getPropertyNames trap is deprecated");
	  },
	
	  // === derived traps ===
	
	  /**
	   * If name denotes a fixed property, check whether the trap returns true.
	   */
	  has: function(name) {
	    var trap = this.getTrap("has");
	    if (trap === undefined) {
	      // default forwarding behavior
	      return Reflect.has(this.target, name);
	    }
	
	    name = String(name);
	    var res = trap.call(this.handler, this.target, name);
	    res = !!res; // coerce to Boolean
	
	    if (res === false) {
	      if (isSealed(name, this.target)) {
	        throw new TypeError("cannot report existing non-configurable own "+
	                            "property '"+ name + "' as a non-existent "+
	                            "property");
	      }
	      if (!Object.isExtensible(this.target) &&
	          isFixed(name, this.target)) {
	          // if handler is allowed to return false, we cannot guarantee
	          // that it will not return true for this property later.
	          // Once a property has been reported as non-existent on a non-extensible
	          // object, it should forever be reported as non-existent
	          throw new TypeError("cannot report existing own property '"+name+
	                              "' as non-existent on a non-extensible object");
	      }
	    }
	
	    // if res === true, we don't need to check for extensibility
	    // even for a non-extensible proxy that has no own name property,
	    // the property may have been inherited
	
	    return res;
	  },
	
	  /**
	   * If name denotes a fixed non-configurable, non-writable data property,
	   * check its return value against the previously asserted value of the
	   * fixed property.
	   */
	  get: function(receiver, name) {
	
	    // experimental support for invoke() trap on platforms that
	    // support __noSuchMethod__
	    /*
	    if (name === '__noSuchMethod__') {
	      var handler = this;
	      return function(name, args) {
	        return handler.invoke(receiver, name, args);
	      }
	    }
	    */
	
	    var trap = this.getTrap("get");
	    if (trap === undefined) {
	      // default forwarding behavior
	      return Reflect.get(this.target, name, receiver);
	    }
	
	    name = String(name);
	    var res = trap.call(this.handler, this.target, name, receiver);
	
	    var fixedDesc = Object.getOwnPropertyDescriptor(this.target, name);
	    // check consistency of the returned value
	    if (fixedDesc !== undefined) { // getting an existing property
	      if (isDataDescriptor(fixedDesc) &&
	          fixedDesc.configurable === false &&
	          fixedDesc.writable === false) { // own frozen data property
	        if (!sameValue(res, fixedDesc.value)) {
	          throw new TypeError("cannot report inconsistent value for "+
	                              "non-writable, non-configurable property '"+
	                              name+"'");
	        }
	      } else { // it's an accessor property
	        if (isAccessorDescriptor(fixedDesc) &&
	            fixedDesc.configurable === false &&
	            fixedDesc.get === undefined) {
	          if (res !== undefined) {
	            throw new TypeError("must report undefined for non-configurable "+
	                                "accessor property '"+name+"' without getter");
	          }
	        }
	      }
	    }
	
	    return res;
	  },
	
	  /**
	   * If name denotes a fixed non-configurable, non-writable data property,
	   * check that the trap rejects the assignment.
	   */
	  set: function(receiver, name, val) {
	    var trap = this.getTrap("set");
	    if (trap === undefined) {
	      // default forwarding behavior
	      return Reflect.set(this.target, name, val, receiver);
	    }
	
	    name = String(name);
	    var res = trap.call(this.handler, this.target, name, val, receiver);
	    res = !!res; // coerce to Boolean
	
	    // if success is reported, check whether property is truly assignable
	    if (res === true) {
	      var fixedDesc = Object.getOwnPropertyDescriptor(this.target, name);
	      if (fixedDesc !== undefined) { // setting an existing property
	        if (isDataDescriptor(fixedDesc) &&
	            fixedDesc.configurable === false &&
	            fixedDesc.writable === false) {
	          if (!sameValue(val, fixedDesc.value)) {
	            throw new TypeError("cannot successfully assign to a "+
	                                "non-writable, non-configurable property '"+
	                                name+"'");
	          }
	        } else {
	          if (isAccessorDescriptor(fixedDesc) &&
	              fixedDesc.configurable === false && // non-configurable
	              fixedDesc.set === undefined) {      // accessor with undefined setter
	            throw new TypeError("setting a property '"+name+"' that has "+
	                                " only a getter");
	          }
	        }
	      }
	    }
	
	    return res;
	  },
	
	  /**
	   * Any own enumerable non-configurable properties of the target that are not
	   * included in the trap result give rise to a TypeError. As such, we check
	   * whether the returned result contains at least all sealed enumerable properties
	   * of the target object.
	   *
	   * The trap should return an iterator.
	   *
	   * However, as implementations of pre-direct proxies still expect enumerate
	   * to return an array of strings, we convert the iterator into an array.
	   */
	  enumerate: function() {
	    var trap = this.getTrap("enumerate");
	    if (trap === undefined) {
	      // default forwarding behavior
	      var trapResult = Reflect.enumerate(this.target);
	      var result = [];
	      var nxt = trapResult.next();
	      while (!nxt.done) {
	        result.push(String(nxt.value));
	        nxt = trapResult.next();
	      }
	      return result;
	    }
	
	    var trapResult = trap.call(this.handler, this.target);
	    
	    if (trapResult === null ||
	        trapResult === undefined ||
	        trapResult.next === undefined) {
	      throw new TypeError("enumerate trap should return an iterator, got: "+
	                          trapResult);    
	    }
	    
	    // propNames is used as a set of strings
	    var propNames = Object.create(null);
	    
	    // var numProps = +trapResult.length;
	    var result = []; // new Array(numProps);
	    
	    // trapResult is supposed to be an iterator
	    // drain iterator to array as current implementations still expect
	    // enumerate to return an array of strings
	    var nxt = trapResult.next();
	    
	    while (!nxt.done) {
	      var s = String(nxt.value);
	      if (propNames[s]) {
	        throw new TypeError("enumerate trap cannot list a "+
	                            "duplicate property '"+s+"'");
	      }
	      propNames[s] = true;
	      result.push(s);
	      nxt = trapResult.next();
	    }
	    
	    /*for (var i = 0; i < numProps; i++) {
	      var s = String(trapResult[i]);
	      if (propNames[s]) {
	        throw new TypeError("enumerate trap cannot list a "+
	                            "duplicate property '"+s+"'");
	      }
	
	      propNames[s] = true;
	      result[i] = s;
	    } */
	
	    var ownEnumerableProps = Object.keys(this.target);
	    var target = this.target;
	    ownEnumerableProps.forEach(function (ownEnumerableProp) {
	      if (!propNames[ownEnumerableProp]) {
	        if (isSealed(ownEnumerableProp, target)) {
	          throw new TypeError("enumerate trap failed to include "+
	                              "non-configurable enumerable property '"+
	                              ownEnumerableProp+"'");
	        }
	        if (!Object.isExtensible(target) &&
	            isFixed(ownEnumerableProp, target)) {
	            // if handler is allowed not to report ownEnumerableProp as an own
	            // property, we cannot guarantee that it will never report it as
	            // an own property later. Once a property has been reported as
	            // non-existent on a non-extensible object, it should forever be
	            // reported as non-existent
	            throw new TypeError("cannot report existing own property '"+
	                                ownEnumerableProp+"' as non-existent on a "+
	                                "non-extensible object");
	        }
	      }
	    });
	
	    return result;
	  },
	
	  /**
	   * The iterate trap is deprecated by the enumerate trap.
	   */
	  iterate: Validator.prototype.enumerate,
	
	  /**
	   * Any own non-configurable properties of the target that are not included
	   * in the trap result give rise to a TypeError. As such, we check whether the
	   * returned result contains at least all sealed properties of the target
	   * object.
	   *
	   * The trap result is normalized.
	   * The trap result is not returned directly. Instead:
	   *  - create and return a fresh Array,
	   *  - of which each element is coerced to String,
	   *  - which does not contain duplicates
	   *
	   * FIXME: keys trap is deprecated
	   */
	  /*
	  keys: function() {
	    var trap = this.getTrap("keys");
	    if (trap === undefined) {
	      // default forwarding behavior
	      return Reflect.keys(this.target);
	    }
	
	    var trapResult = trap.call(this.handler, this.target);
	
	    // propNames is used as a set of strings
	    var propNames = Object.create(null);
	    var numProps = +trapResult.length;
	    var result = new Array(numProps);
	
	    for (var i = 0; i < numProps; i++) {
	     var s = String(trapResult[i]);
	     if (propNames[s]) {
	       throw new TypeError("keys trap cannot list a "+
	                           "duplicate property '"+s+"'");
	     }
	     if (!Object.isExtensible(this.target) && !isFixed(s, this.target)) {
	       // non-extensible proxies don't tolerate new own property names
	       throw new TypeError("keys trap cannot list a new "+
	                           "property '"+s+"' on a non-extensible object");
	     }
	
	     propNames[s] = true;
	     result[i] = s;
	    }
	
	    var ownEnumerableProps = Object.keys(this.target);
	    var target = this.target;
	    ownEnumerableProps.forEach(function (ownEnumerableProp) {
	      if (!propNames[ownEnumerableProp]) {
	        if (isSealed(ownEnumerableProp, target)) {
	          throw new TypeError("keys trap failed to include "+
	                              "non-configurable enumerable property '"+
	                              ownEnumerableProp+"'");
	        }
	        if (!Object.isExtensible(target) &&
	            isFixed(ownEnumerableProp, target)) {
	            // if handler is allowed not to report ownEnumerableProp as an own
	            // property, we cannot guarantee that it will never report it as
	            // an own property later. Once a property has been reported as
	            // non-existent on a non-extensible object, it should forever be
	            // reported as non-existent
	            throw new TypeError("cannot report existing own property '"+
	                                ownEnumerableProp+"' as non-existent on a "+
	                                "non-extensible object");
	        }
	      }
	    });
	
	    return result;
	  },
	  */
	  
	  /**
	   * New trap that reifies [[Call]].
	   * If the target is a function, then a call to
	   *   proxy(...args)
	   * Triggers this trap
	   */
	  apply: function(target, thisBinding, args) {
	    var trap = this.getTrap("apply");
	    if (trap === undefined) {
	      return Reflect.apply(target, thisBinding, args);
	    }
	
	    if (typeof this.target === "function") {
	      return trap.call(this.handler, target, thisBinding, args);
	    } else {
	      throw new TypeError("apply: "+ target + " is not a function");
	    }
	  },
	
	  /**
	   * New trap that reifies [[Construct]].
	   * If the target is a function, then a call to
	   *   new proxy(...args)
	   * Triggers this trap
	   */
	  construct: function(target, args, newTarget) {
	    var trap = this.getTrap("construct");
	    if (trap === undefined) {
	      return Reflect.construct(target, args, newTarget);
	    }
	
	    if (typeof target !== "function") {
	      throw new TypeError("new: "+ target + " is not a function");
	    }
	
	    if (newTarget === undefined) {
	      newTarget = target;
	    } else {
	      if (typeof newTarget !== "function") {
	        throw new TypeError("new: "+ newTarget + " is not a function");
	      }      
	    }
	    return trap.call(this.handler, target, args, newTarget);
	  }
	};
	
	// ---- end of the Validator handler wrapper handler ----
	
	// In what follows, a 'direct proxy' is a proxy
	// whose handler is a Validator. Such proxies can be made non-extensible,
	// sealed or frozen without losing the ability to trap.
	
	// maps direct proxies to their Validator handlers
	var directProxies = new WeakMap();
	
	// patch Object.{preventExtensions,seal,freeze} so that
	// they recognize fixable proxies and act accordingly
	Object.preventExtensions = function(subject) {
	  var vhandler = directProxies.get(subject);
	  if (vhandler !== undefined) {
	    if (vhandler.preventExtensions()) {
	      return subject;
	    } else {
	      throw new TypeError("preventExtensions on "+subject+" rejected");
	    }
	  } else {
	    return prim_preventExtensions(subject);
	  }
	};
	Object.seal = function(subject) {
	  setIntegrityLevel(subject, "sealed");
	  return subject;
	};
	Object.freeze = function(subject) {
	  setIntegrityLevel(subject, "frozen");
	  return subject;
	};
	Object.isExtensible = Object_isExtensible = function(subject) {
	  var vHandler = directProxies.get(subject);
	  if (vHandler !== undefined) {
	    return vHandler.isExtensible();
	  } else {
	    return prim_isExtensible(subject);
	  }
	};
	Object.isSealed = Object_isSealed = function(subject) {
	  return testIntegrityLevel(subject, "sealed");
	};
	Object.isFrozen = Object_isFrozen = function(subject) {
	  return testIntegrityLevel(subject, "frozen");
	};
	Object.getPrototypeOf = Object_getPrototypeOf = function(subject) {
	  var vHandler = directProxies.get(subject);
	  if (vHandler !== undefined) {
	    return vHandler.getPrototypeOf();
	  } else {
	    return prim_getPrototypeOf(subject);
	  }
	};
	
	// patch Object.getOwnPropertyDescriptor to directly call
	// the Validator.prototype.getOwnPropertyDescriptor trap
	// This is to circumvent an assertion in the built-in Proxy
	// trapping mechanism of v8, which disallows that trap to
	// return non-configurable property descriptors (as per the
	// old Proxy design)
	Object.getOwnPropertyDescriptor = function(subject, name) {
	  var vhandler = directProxies.get(subject);
	  if (vhandler !== undefined) {
	    return vhandler.getOwnPropertyDescriptor(name);
	  } else {
	    return prim_getOwnPropertyDescriptor(subject, name);
	  }
	};
	
	// patch Object.defineProperty to directly call
	// the Validator.prototype.defineProperty trap
	// This is to circumvent two issues with the built-in
	// trap mechanism:
	// 1) the current tracemonkey implementation of proxies
	// auto-completes 'desc', which is not correct. 'desc' should be
	// normalized, but not completed. Consider:
	// Object.defineProperty(proxy, 'foo', {enumerable:false})
	// This trap will receive desc =
	//  {value:undefined,writable:false,enumerable:false,configurable:false}
	// This will also set all other attributes to their default value,
	// which is unexpected and different from [[DefineOwnProperty]].
	// Bug filed: https://bugzilla.mozilla.org/show_bug.cgi?id=601329
	// 2) the current spidermonkey implementation does not
	// throw an exception when this trap returns 'false', but instead silently
	// ignores the operation (this is regardless of strict-mode)
	// 2a) v8 does throw an exception for this case, but includes the rather
	//     unhelpful error message:
	// 'Proxy handler #<Object> returned false from 'defineProperty' trap'
	Object.defineProperty = function(subject, name, desc) {
	  var vhandler = directProxies.get(subject);
	  if (vhandler !== undefined) {
	    var normalizedDesc = normalizePropertyDescriptor(desc);
	    var success = vhandler.defineProperty(name, normalizedDesc);
	    if (success === false) {
	      throw new TypeError("can't redefine property '"+name+"'");
	    }
	    return subject;
	  } else {
	    return prim_defineProperty(subject, name, desc);
	  }
	};
	
	Object.defineProperties = function(subject, descs) {
	  var vhandler = directProxies.get(subject);
	  if (vhandler !== undefined) {
	    var names = Object.keys(descs);
	    for (var i = 0; i < names.length; i++) {
	      var name = names[i];
	      var normalizedDesc = normalizePropertyDescriptor(descs[name]);
	      var success = vhandler.defineProperty(name, normalizedDesc);
	      if (success === false) {
	        throw new TypeError("can't redefine property '"+name+"'");
	      }
	    }
	    return subject;
	  } else {
	    return prim_defineProperties(subject, descs);
	  }
	};
	
	Object.keys = function(subject) {
	  var vHandler = directProxies.get(subject);
	  if (vHandler !== undefined) {
	    var ownKeys = vHandler.ownKeys();
	    var result = [];
	    for (var i = 0; i < ownKeys.length; i++) {
	      var k = String(ownKeys[i]);
	      var desc = Object.getOwnPropertyDescriptor(subject, k);
	      if (desc !== undefined && desc.enumerable === true) {
	        result.push(k);
	      }
	    }
	    return result;
	  } else {
	    return prim_keys(subject);
	  }
	}
	
	Object.getOwnPropertyNames = Object_getOwnPropertyNames = function(subject) {
	  var vHandler = directProxies.get(subject);
	  if (vHandler !== undefined) {
	    return vHandler.ownKeys();
	  } else {
	    return prim_getOwnPropertyNames(subject);
	  }
	}
	
	// fixes issue #71 (Calling Object.getOwnPropertySymbols() on a Proxy
	// throws an error)
	if (prim_getOwnPropertySymbols !== undefined) {
	  Object.getOwnPropertySymbols = function(subject) {
	    var vHandler = directProxies.get(subject);
	    if (vHandler !== undefined) {
	      // as this shim does not support symbols, a Proxy never advertises
	      // any symbol-valued own properties
	      return [];
	    } else {
	      return prim_getOwnPropertySymbols(subject);
	    }
	  };
	}
	
	// fixes issue #72 ('Illegal access' error when using Object.assign)
	// Object.assign polyfill based on a polyfill posted on MDN: 
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/\
	//  Global_Objects/Object/assign
	// Note that this polyfill does not support Symbols, but this Proxy Shim
	// does not support Symbols anyway.
	if (prim_assign !== undefined) {
	  Object.assign = function (target) {
	    
	    // check if any argument is a proxy object
	    var noProxies = true;
	    for (var i = 0; i < arguments.length; i++) {
	      var vHandler = directProxies.get(arguments[i]);
	      if (vHandler !== undefined) {
	        noProxies = false;
	        break;
	      }
	    }
	    if (noProxies) {
	      // not a single argument is a proxy, perform built-in algorithm
	      return prim_assign.apply(Object, arguments);
	    }
	    
	    // there is at least one proxy argument, use the polyfill
	    
	    if (target === undefined || target === null) {
	      throw new TypeError('Cannot convert undefined or null to object');
	    }
	
	    var output = Object(target);
	    for (var index = 1; index < arguments.length; index++) {
	      var source = arguments[index];
	      if (source !== undefined && source !== null) {
	        for (var nextKey in source) {
	          if (source.hasOwnProperty(nextKey)) {
	            output[nextKey] = source[nextKey];
	          }
	        }
	      }
	    }
	    return output;
	  };
	}
	
	// returns whether an argument is a reference to an object,
	// which is legal as a WeakMap key.
	function isObject(arg) {
	  var type = typeof arg;
	  return (type === 'object' && arg !== null) || (type === 'function');
	};
	
	// a wrapper for WeakMap.get which returns the undefined value
	// for keys that are not objects (in which case the underlying
	// WeakMap would have thrown a TypeError).
	function safeWeakMapGet(map, key) {
	  return isObject(key) ? map.get(key) : undefined;
	};
	
	// returns a new function of zero arguments that recursively
	// unwraps any proxies specified as the |this|-value.
	// The primitive is assumed to be a zero-argument method
	// that uses its |this|-binding.
	function makeUnwrapping0ArgMethod(primitive) {
	  return function builtin() {
	    var vHandler = safeWeakMapGet(directProxies, this);
	    if (vHandler !== undefined) {
	      return builtin.call(vHandler.target);
	    } else {
	      return primitive.call(this);
	    }
	  }
	};
	
	// returns a new function of 1 arguments that recursively
	// unwraps any proxies specified as the |this|-value.
	// The primitive is assumed to be a 1-argument method
	// that uses its |this|-binding.
	function makeUnwrapping1ArgMethod(primitive) {
	  return function builtin(arg) {
	    var vHandler = safeWeakMapGet(directProxies, this);
	    if (vHandler !== undefined) {
	      return builtin.call(vHandler.target, arg);
	    } else {
	      return primitive.call(this, arg);
	    }
	  }
	};
	
	Object.prototype.valueOf =
	  makeUnwrapping0ArgMethod(Object.prototype.valueOf);
	Object.prototype.toString =
	  makeUnwrapping0ArgMethod(Object.prototype.toString);
	Function.prototype.toString =
	  makeUnwrapping0ArgMethod(Function.prototype.toString);
	Date.prototype.toString =
	  makeUnwrapping0ArgMethod(Date.prototype.toString);
	
	Object.prototype.isPrototypeOf = function builtin(arg) {
	  // bugfix thanks to Bill Mark:
	  // built-in isPrototypeOf does not unwrap proxies used
	  // as arguments. So, we implement the builtin ourselves,
	  // based on the ECMAScript 6 spec. Our encoding will
	  // make sure that if a proxy is used as an argument,
	  // its getPrototypeOf trap will be called.
	  while (true) {
	    var vHandler2 = safeWeakMapGet(directProxies, arg);
	    if (vHandler2 !== undefined) {
	      arg = vHandler2.getPrototypeOf();
	      if (arg === null) {
	        return false;
	      } else if (sameValue(arg, this)) {
	        return true;
	      }
	    } else {
	      return prim_isPrototypeOf.call(this, arg);
	    }
	  }
	};
	
	Array.isArray = function(subject) {
	  var vHandler = safeWeakMapGet(directProxies, subject);
	  if (vHandler !== undefined) {
	    return Array.isArray(vHandler.target);
	  } else {
	    return prim_isArray(subject);
	  }
	};
	
	function isProxyArray(arg) {
	  var vHandler = safeWeakMapGet(directProxies, arg);
	  if (vHandler !== undefined) {
	    return Array.isArray(vHandler.target);
	  }
	  return false;
	}
	
	// Array.prototype.concat internally tests whether one of its
	// arguments is an Array, by checking whether [[Class]] == "Array"
	// As such, it will fail to recognize proxies-for-arrays as arrays.
	// We patch Array.prototype.concat so that it "unwraps" proxies-for-arrays
	// by making a copy. This will trigger the exact same sequence of
	// traps on the proxy-for-array as if we would not have unwrapped it.
	// See <https://github.com/tvcutsem/harmony-reflect/issues/19> for more.
	Array.prototype.concat = function(/*...args*/) {
	  var length;
	  for (var i = 0; i < arguments.length; i++) {
	    if (isProxyArray(arguments[i])) {
	      length = arguments[i].length;
	      arguments[i] = Array.prototype.slice.call(arguments[i], 0, length);
	    }
	  }
	  return prim_concat.apply(this, arguments);
	};
	
	// setPrototypeOf support on platforms that support __proto__
	
	var prim_setPrototypeOf = Object.setPrototypeOf;
	
	// patch and extract original __proto__ setter
	var __proto__setter = (function() {
	  var protoDesc = prim_getOwnPropertyDescriptor(Object.prototype,'__proto__');
	  if (protoDesc === undefined ||
	      typeof protoDesc.set !== "function") {
	    return function() {
	      throw new TypeError("setPrototypeOf not supported on this platform");
	    }
	  }
	
	  // see if we can actually mutate a prototype with the generic setter
	  // (e.g. Chrome v28 doesn't allow setting __proto__ via the generic setter)
	  try {
	    protoDesc.set.call({},{});
	  } catch (e) {
	    return function() {
	      throw new TypeError("setPrototypeOf not supported on this platform");
	    }
	  }
	
	  prim_defineProperty(Object.prototype, '__proto__', {
	    set: function(newProto) {
	      return Object.setPrototypeOf(this, Object(newProto));
	    }
	  });
	
	  return protoDesc.set;
	}());
	
	Object.setPrototypeOf = function(target, newProto) {
	  var handler = directProxies.get(target);
	  if (handler !== undefined) {
	    if (handler.setPrototypeOf(newProto)) {
	      return target;
	    } else {
	      throw new TypeError("proxy rejected prototype mutation");
	    }
	  } else {
	    if (!Object_isExtensible(target)) {
	      throw new TypeError("can't set prototype on non-extensible object: " +
	                          target);
	    }
	    if (prim_setPrototypeOf)
	      return prim_setPrototypeOf(target, newProto);
	
	    if (Object(newProto) !== newProto || newProto === null) {
	      throw new TypeError("Object prototype may only be an Object or null: " +
	                         newProto);
	      // throw new TypeError("prototype must be an object or null")
	    }
	    __proto__setter.call(target, newProto);
	    return target;
	  }
	}
	
	Object.prototype.hasOwnProperty = function(name) {
	  var handler = safeWeakMapGet(directProxies, this);
	  if (handler !== undefined) {
	    var desc = handler.getOwnPropertyDescriptor(name);
	    return desc !== undefined;
	  } else {
	    return prim_hasOwnProperty.call(this, name);
	  }
	}
	
	// ============= Reflection module =============
	// see http://wiki.ecmascript.org/doku.php?id=harmony:reflect_api
	
	var Reflect = global.Reflect = {
	  getOwnPropertyDescriptor: function(target, name) {
	    return Object.getOwnPropertyDescriptor(target, name);
	  },
	  defineProperty: function(target, name, desc) {
	
	    // if target is a proxy, invoke its "defineProperty" trap
	    var handler = directProxies.get(target);
	    if (handler !== undefined) {
	      return handler.defineProperty(target, name, desc);
	    }
	
	    // Implementation transliterated from [[DefineOwnProperty]]
	    // see ES5.1 section 8.12.9
	    // this is the _exact same algorithm_ as the isCompatibleDescriptor
	    // algorithm defined above, except that at every place it
	    // returns true, this algorithm actually does define the property.
	    var current = Object.getOwnPropertyDescriptor(target, name);
	    var extensible = Object.isExtensible(target);
	    if (current === undefined && extensible === false) {
	      return false;
	    }
	    if (current === undefined && extensible === true) {
	      Object.defineProperty(target, name, desc); // should never fail
	      return true;
	    }
	    if (isEmptyDescriptor(desc)) {
	      return true;
	    }
	    if (isEquivalentDescriptor(current, desc)) {
	      return true;
	    }
	    if (current.configurable === false) {
	      if (desc.configurable === true) {
	        return false;
	      }
	      if ('enumerable' in desc && desc.enumerable !== current.enumerable) {
	        return false;
	      }
	    }
	    if (isGenericDescriptor(desc)) {
	      // no further validation necessary
	    } else if (isDataDescriptor(current) !== isDataDescriptor(desc)) {
	      if (current.configurable === false) {
	        return false;
	      }
	    } else if (isDataDescriptor(current) && isDataDescriptor(desc)) {
	      if (current.configurable === false) {
	        if (current.writable === false && desc.writable === true) {
	          return false;
	        }
	        if (current.writable === false) {
	          if ('value' in desc && !sameValue(desc.value, current.value)) {
	            return false;
	          }
	        }
	      }
	    } else if (isAccessorDescriptor(current) && isAccessorDescriptor(desc)) {
	      if (current.configurable === false) {
	        if ('set' in desc && !sameValue(desc.set, current.set)) {
	          return false;
	        }
	        if ('get' in desc && !sameValue(desc.get, current.get)) {
	          return false;
	        }
	      }
	    }
	    Object.defineProperty(target, name, desc); // should never fail
	    return true;
	  },
	  deleteProperty: function(target, name) {
	    var handler = directProxies.get(target);
	    if (handler !== undefined) {
	      return handler.delete(name);
	    }
	    
	    var desc = Object.getOwnPropertyDescriptor(target, name);
	    if (desc === undefined) {
	      return true;
	    }
	    if (desc.configurable === true) {
	      delete target[name];
	      return true;
	    }
	    return false;    
	  },
	  getPrototypeOf: function(target) {
	    return Object.getPrototypeOf(target);
	  },
	  setPrototypeOf: function(target, newProto) {
	    
	    var handler = directProxies.get(target);
	    if (handler !== undefined) {
	      return handler.setPrototypeOf(newProto);
	    }
	    
	    if (Object(newProto) !== newProto || newProto === null) {
	      throw new TypeError("Object prototype may only be an Object or null: " +
	                         newProto);
	    }
	    
	    if (!Object_isExtensible(target)) {
	      return false;
	    }
	    
	    var current = Object.getPrototypeOf(target);
	    if (sameValue(current, newProto)) {
	      return true;
	    }
	    
	    if (prim_setPrototypeOf) {
	      try {
	        prim_setPrototypeOf(target, newProto);
	        return true;
	      } catch (e) {
	        return false;
	      }
	    }
	
	    __proto__setter.call(target, newProto);
	    return true;
	  },
	  preventExtensions: function(target) {
	    var handler = directProxies.get(target);
	    if (handler !== undefined) {
	      return handler.preventExtensions();
	    }
	    prim_preventExtensions(target);
	    return true;
	  },
	  isExtensible: function(target) {
	    return Object.isExtensible(target);
	  },
	  has: function(target, name) {
	    return name in target;
	  },
	  get: function(target, name, receiver) {
	    receiver = receiver || target;
	
	    // if target is a proxy, invoke its "get" trap
	    var handler = directProxies.get(target);
	    if (handler !== undefined) {
	      return handler.get(receiver, name);
	    }
	
	    var desc = Object.getOwnPropertyDescriptor(target, name);
	    if (desc === undefined) {
	      var proto = Object.getPrototypeOf(target);
	      if (proto === null) {
	        return undefined;
	      }
	      return Reflect.get(proto, name, receiver);
	    }
	    if (isDataDescriptor(desc)) {
	      return desc.value;
	    }
	    var getter = desc.get;
	    if (getter === undefined) {
	      return undefined;
	    }
	    return desc.get.call(receiver);
	  },
	  // Reflect.set implementation based on latest version of [[SetP]] at
	  // http://wiki.ecmascript.org/doku.php?id=harmony:proto_climbing_refactoring
	  set: function(target, name, value, receiver) {
	    receiver = receiver || target;
	
	    // if target is a proxy, invoke its "set" trap
	    var handler = directProxies.get(target);
	    if (handler !== undefined) {
	      return handler.set(receiver, name, value);
	    }
	
	    // first, check whether target has a non-writable property
	    // shadowing name on receiver
	    var ownDesc = Object.getOwnPropertyDescriptor(target, name);
	
	    if (ownDesc === undefined) {
	      // name is not defined in target, search target's prototype
	      var proto = Object.getPrototypeOf(target);
	
	      if (proto !== null) {
	        // continue the search in target's prototype
	        return Reflect.set(proto, name, value, receiver);
	      }
	
	      // Rev16 change. Cf. https://bugs.ecmascript.org/show_bug.cgi?id=1549
	      // target was the last prototype, now we know that 'name' is not shadowed
	      // by an existing (accessor or data) property, so we can add the property
	      // to the initial receiver object
	      // (this branch will intentionally fall through to the code below)
	      ownDesc =
	        { value: undefined,
	          writable: true,
	          enumerable: true,
	          configurable: true };
	    }
	
	    // we now know that ownDesc !== undefined
	    if (isAccessorDescriptor(ownDesc)) {
	      var setter = ownDesc.set;
	      if (setter === undefined) return false;
	      setter.call(receiver, value); // assumes Function.prototype.call
	      return true;
	    }
	    // otherwise, isDataDescriptor(ownDesc) must be true
	    if (ownDesc.writable === false) return false;
	    // we found an existing writable data property on the prototype chain.
	    // Now update or add the data property on the receiver, depending on
	    // whether the receiver already defines the property or not.
	    var existingDesc = Object.getOwnPropertyDescriptor(receiver, name);
	    if (existingDesc !== undefined) {
	      var updateDesc =
	        { value: value,
	          // FIXME: it should not be necessary to describe the following
	          // attributes. Added to circumvent a bug in tracemonkey:
	          // https://bugzilla.mozilla.org/show_bug.cgi?id=601329
	          writable:     existingDesc.writable,
	          enumerable:   existingDesc.enumerable,
	          configurable: existingDesc.configurable };
	      Object.defineProperty(receiver, name, updateDesc);
	      return true;
	    } else {
	      if (!Object.isExtensible(receiver)) return false;
	      var newDesc =
	        { value: value,
	          writable: true,
	          enumerable: true,
	          configurable: true };
	      Object.defineProperty(receiver, name, newDesc);
	      return true;
	    }
	  },
	  /*invoke: function(target, name, args, receiver) {
	    receiver = receiver || target;
	
	    var handler = directProxies.get(target);
	    if (handler !== undefined) {
	      return handler.invoke(receiver, name, args);
	    }
	
	    var fun = Reflect.get(target, name, receiver);
	    return Function.prototype.apply.call(fun, receiver, args);
	  },*/
	  enumerate: function(target) {
	    var handler = directProxies.get(target);
	    var result;
	    if (handler !== undefined) {
	      // handler.enumerate should return an iterator directly, but the
	      // iterator gets converted to an array for backward-compat reasons,
	      // so we must re-iterate over the array
	      result = handler.enumerate(handler.target);
	    } else {
	      result = [];
	      for (var name in target) { result.push(name); };      
	    }
	    var l = +result.length;
	    var idx = 0;
	    return {
	      next: function() {
	        if (idx === l) return { done: true };
	        return { done: false, value: result[idx++] };
	      }
	    };
	  },
	  // imperfect ownKeys implementation: in ES6, should also include
	  // symbol-keyed properties.
	  ownKeys: function(target) {
	    return Object_getOwnPropertyNames(target);
	  },
	  apply: function(target, receiver, args) {
	    // target.apply(receiver, args)
	    return Function.prototype.apply.call(target, receiver, args);
	  },
	  construct: function(target, args, newTarget) {
	    // return new target(...args);
	
	    // if target is a proxy, invoke its "construct" trap
	    var handler = directProxies.get(target);
	    if (handler !== undefined) {
	      return handler.construct(handler.target, args, newTarget);
	    }
	    
	    if (typeof target !== "function") {
	      throw new TypeError("target is not a function: " + target);
	    }
	    if (newTarget === undefined) {
	      newTarget = target;
	    } else {
	      if (typeof newTarget !== "function") {
	        throw new TypeError("newTarget is not a function: " + target);
	      }      
	    }
	
	    return new (Function.prototype.bind.apply(newTarget, [null].concat(args)));
	  }
	};
	
	// feature-test whether the Proxy global exists, with
	// the harmony-era Proxy.create API
	if (typeof Proxy !== "undefined" &&
	    typeof Proxy.create !== "undefined") {
	
	  var primCreate = Proxy.create,
	      primCreateFunction = Proxy.createFunction;
	
	  var revokedHandler = primCreate({
	    get: function() { throw new TypeError("proxy is revoked"); }
	  });
	
	  global.Proxy = function(target, handler) {
	    // check that target is an Object
	    if (Object(target) !== target) {
	      throw new TypeError("Proxy target must be an Object, given "+target);
	    }
	    // check that handler is an Object
	    if (Object(handler) !== handler) {
	      throw new TypeError("Proxy handler must be an Object, given "+handler);
	    }
	
	    var vHandler = new Validator(target, handler);
	    var proxy;
	    if (typeof target === "function") {
	      proxy = primCreateFunction(vHandler,
	        // call trap
	        function() {
	          var args = Array.prototype.slice.call(arguments);
	          return vHandler.apply(target, this, args);
	        },
	        // construct trap
	        function() {
	          var args = Array.prototype.slice.call(arguments);
	          return vHandler.construct(target, args);
	        });
	    } else {
	      proxy = primCreate(vHandler, Object.getPrototypeOf(target));
	    }
	    directProxies.set(proxy, vHandler);
	    return proxy;
	  };
	
	  global.Proxy.revocable = function(target, handler) {
	    var proxy = new Proxy(target, handler);
	    var revoke = function() {
	      var vHandler = directProxies.get(proxy);
	      if (vHandler !== null) {
	        vHandler.target  = null;
	        vHandler.handler = revokedHandler;
	      }
	      return undefined;
	    };
	    return {proxy: proxy, revoke: revoke};
	  }
	  
	  // add the old Proxy.create and Proxy.createFunction methods
	  // so old code that still depends on the harmony-era Proxy object
	  // is not broken. Also ensures that multiple versions of this
	  // library should load fine
	  global.Proxy.create = primCreate;
	  global.Proxy.createFunction = primCreateFunction;
	
	} else {
	  // Proxy global not defined, or old API not available
	  if (typeof Proxy === "undefined") {
	    // Proxy global not defined, add a Proxy function stub
	    global.Proxy = function(_target, _handler) {
	      throw new Error("proxies not supported on this platform. On v8/node/iojs, make sure to pass the --harmony_proxies flag");
	    };
	  }
	  // Proxy global defined but old API not available
	  // presumably Proxy global already supports new API, leave untouched
	}
	
	// for node.js modules, export every property in the Reflect object
	// as part of the module interface
	if (true) {
	  Object.keys(Reflect).forEach(function (key) {
	    exports[key] = Reflect[key];
	  });
	}
	
	// function-as-module pattern
	}( true ? global : this));
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ])
});
;
//# sourceMappingURL=easymodel.js.map