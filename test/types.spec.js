import chai from 'chai';
import { Text } from '../src/types';

chai.expect();

const expect = chai.expect;
const assert = chai.assert;

let text = undefined;

describe('Given an instance of Type text (TextType)', () => {
  before(() => {
    text = new Text();
  });

  it('Should be instanceof TextType', () => {
    expect(text instanceof Text).to.be.true;
  });

});
