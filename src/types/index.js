import _ from 'underscore';
import EasyLogs from 'easylogs';
import 'harmony-reflect';

const Types = (() => {
  const logger = new EasyLogs();

  const allowedProps = [
    'type',
    'pattern',
    'length',
    'required',
    'validator'
  ];

  let self = {};

  class GenericType {
    constructor(typeCustom = {}, userCustom = {}) {
      const userCustomIsObject = _.isObject(userCustom);
      const typeCustomIsObject = _.isObject(typeCustom);

      if (!userCustomIsObject || !typeCustomIsObject) {
        typeCustom = typeCustomIsObject ? typeCustom : {};
        userCustom = userCustomIsObject ? userCustom : {};

        logger.error('The element used to generate a custom Type is not valid and it will be discarded. Please check your model');
      }

      const custom = Object.assign({}, typeCustom, userCustom);
      _(custom).each((type, propName) => {
        if (allowedProps.includes(propName)) {
          Object.defineProperty(this, propName, {
            // Define setter/getter for each propName in the model
            set: (newValue) => { self[propName] = newValue; },
            get: () => self[propName]
          });
        } else {
          logger.error(`${propName} is not a valid option, so it has been discarded. Please check your model`);
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
    }
  }

  class TextType extends GenericType {
    constructor(userCustom = {}) {
      const typeCustom = {
        type: 'text'
      };

      super(typeCustom, userCustom);
    }
  }

  class NumberType extends GenericType {
    constructor(userCustom) {
      const typeCustom = {
        type: 'number',
        validator: /^\d+$/
      };

      super(typeCustom, userCustom);
    }
  }

  return {
    TextType,
    NumberType
  };
})();

export default {
  Text: Types.TextType,
  Number: Types.NumberType
};
