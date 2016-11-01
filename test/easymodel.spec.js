import chai from 'chai';
import EasyModel from '../src/index.js';

chai.expect();

const expect = chai.expect;
const assert = chai.assert;

let book;
const bookModel = {
  title: 'text',
  pages: 'number'
};

class Book extends EasyModel {
  model = bookModel
  read() {
    console.log('Reading...');
  }
}

describe('Given an instance of the subclass Book of EasyModel', () => {
  before(() => {
    book = new Book();
  });

  it('Should be instanceof EasyModel', () => {
    expect(book instanceof EasyModel).to.be.true;
  });

  it('Should have a model equal to Book model', () => {
    assert.deepEqual(book.model, bookModel);
  });

  it('Should have a method typeOf correctly detecting all the types of the elements passed', () => {
    const areObjects = [];
    areObjects.push(book.typeOf(NaN) === 'NaN');
    areObjects.push(book.typeOf([]) === 'array');
    areObjects.push(book.typeOf(null) === 'null');
    areObjects.push(book.typeOf({}) === 'object');
    areObjects.push(book.typeOf(123) === 'number');
    areObjects.push(book.typeOf(true) === 'boolean');
    areObjects.push(book.typeOf(/.+/gi) === 'regexp');
    areObjects.push(book.typeOf(() => {}) === 'function');
    areObjects.push(book.typeOf(undefined) === 'undefined');
    areObjects.push(book.typeOf("I'm an object") === 'string');

    expect(areObjects.every(res => res === true)).to.be.true;
  });

  xit('Should correctly validate new values', () => {

  });

  it('Should correctly update values', () => {
    // throw book.title
    book.title = 'Duh!';
    expect(book.title).to.be.equal('Duh!');
  });

  it('Should correctly update values', () => {
    book.title = 'Duh!';
    expect(book.title).to.be.equal('Duh!');
  });

  // TODO: We don't want to let manipulate (read/write) on our object manually.
  // So ideally we want to implement some kind of universal getter/setter that only allows read/write
  // on property defined in the model. That's not possible at the moment tho, expect using Proxy. Proxies tho
  // can't be subclassed so using proxies we lose the power to create our custom instances.
  // So for the time being that's just a dream :)
  xit('Should throw trying to lookup undefined values', () => {
    expect(book.iDontExists).to.throw;
  });
  xit('Should throw trying set a prop that is not on the Model', () => {
    expect(book.iDontExists = 'poorMe').to.throw;
  });



});
