import _ from 'underscore';
import EasyLogs from 'easylogs';

import Types from './types';

const EasyModel = (() => {
  // We are gonna overwrite it, but still, for readability, let's assign it to an Object
  let _data = {};
  let _model = {};
  let _types = {};

  class EasyModel {
    // Constructor's called on class instanciation. Expects an Object
    constructor(options) {
      this.logger = new EasyLogs();

      if (_.isObject(options)) {
        this.logger.info(`EasyModel constructor called. Options: ${this.logger.beautify(options)}`);
        this.setValue(options);
      } else {
        this.logger.warn(`You are creating an empy EasyModel's instance, is that what you want? Expected an argument of type Object but got ${typeof options} instead`);
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

    set model(model) {
      if (_.isObject(model)) {
        this.logger.info(`Setting new model: ${this.logger.beautify(model)}`);
      } else {
        throw new Error(`Can't set model to ${typeof model}. Please provide an Object instead`);
      }

      // TODO: Check if the context is the correct one.. probably not tho.
      // NOTE: I actually believe the context is the correct one ;D
      _(model).each((type, propName) => {
        Object.defineProperty(this, propName, {
          // Define setter/getter for each propName in the model
          set: newValue => this.setValue(newValue, propName),
          get: () => this.getValue(propName)
        });

        if (_.isString(model[propName])) {
          // check if model already contains the type (ex. 'text')
          //   if YES, skip
          //   if NO
          //      generate new Type instance
          //      store it into _types
        } else if (_.isObject(model[propName])) {
          // Extend Type
          // generate new Type instance
        } else {
          // Throw error, we only accept strings or objects
        }
      });

      _model = model;
    }

    get model() {
      return _model;
    }

    // Should return an object like:
    // {
    //   result: Bool
    //   reason: String
    // }
    validate(type, value, propName) {
      // Accumulator of validations result. Already contains one true value so it will pass the validation
      // if no validators are provided
      const validationResult = [true];
      // Custom typeof string. See method typeOf for more informations about it
      const typeofValue = this.typeOf(value);
      const dataType = this.getDataType(type);

      // If RegExp
      if (dataType.pattern) {
        let patternResult = false;
        // TODO: Here we are somehow validating the RegExp, but it shouldn't happen here but when the RegExp is set
        if (_.isRegExp(dataType.pattern)) {
          patternResult = new RegExp(dataType.pattern).test(value);
        }
        validationResult.push(patternResult);
      }
      // If max length
      if (dataType.length) {
        let lengthResult = true;
        switch (typeofValue) {
          case 'string':
          case 'number': {
            lengthResult = value.toString().length <= dataType.length;
            break;
          }
          case 'array': {
            lengthResult = value.length <= dataType.length;
            break;
          }
          default: {
            this.logger.warn(`Cannot use length validator to validate ${typeofValue} (Property: ${propName})`);
          }
        }
        validationResult.push(lengthResult);
      }
      // If required (we check if a value exists)
      if (dataType.required) {
        const tmpValue = typeofValue === 'number' ? value.toString() : value;
        validationResult.push(!_.isEmpty(tmpValue));
      }
      // A custom function is passed
      if (dataType.validator) {
        let validatorResult = true;
        if (_.isFunction(dataType.validator)) {
          validatorResult = dataType.validator(value);
        } else {
          throw new Error(`Trying to execute validator, but found it's not a function. Please check it`);
        }
        validationResult.push(validatorResult);
      }

      return validationResult.every(result => result);
    }

    // newValue: Any    - The new value/values
    // propName: String - Refer to the name of the field, optional
    // Method used to update a property value.
    // On the model is also possible to define before/after hooks that will be executed respectively
    // before and after setting the value
    setValue(newValue, propName) {
      const type = _model[propName];

      // Is the property an existing model's prop?
      if (!_model[propName]) {
        throw new Error(`The property ${propName} doesn't match any prop on the Model`);
      }

      // Fire before hook, if existing
      // check if before hook exists, procede if YES
      //   execute it, if there's a returned value, that's the newValue

      // Validate the new value
      if (!this.validate(type, newValue, propName)) {
        throw new Error(`Validation failed. Can't assign value: ${newValue} to ${propName}`);
      }

      // If a propName is passed it means we want to update one specific prop, so we transform it to and Object
      // in order to make it digestible by Object.assign
      if (propName) {
        newValue = {
          [propName]: newValue
        };
      }

      _data = Object.assign(_data, newValue);

      // Fire after hook, if existing
      // check if after hook exists, procede if YES
      //   execute it
    }

    getValue(propName) {
      const value = _data[propName];

      if (!value) {
        throw new Error(`Can't read value of ${propName} because it's undefined`);
      }

      return value;
    }

    /******************
    *** Utils
    ******************/

    extendType() {

    }

    typeOf(element) {
      const _element = _(element);

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
      this.logger.warn(`typeOf of ${element} element failed. Check the element and check the function`);
      return 'undefined';
    }

    getDataType(type) {
      const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
      const typeKey = capitalize(type);
      const dataType = new Types[typeKey]();

      if (!dataType) {
        throw new Error(`Unable to find type ${type}`);
      }

      return type;
    }
  }

  return EasyModel;
})();

export default EasyModel

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
