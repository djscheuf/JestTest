import complexCondition from './complexCondition';

import doTheThing from './somewhere/doTheThing';
jest.mock('./somewhere/doTheThing');

import randomApi from './somewhereElse/randomApi';
jest.mock('./somewhereElse/randomApi');

describe('Complex Condition', () => {
  describe('given some _stuff_, and a _flag_', () => {
    let stuff, thisFlag;
    beforeEach(() => { 
      stuff = {prop:'value', otherProp: 'anotherVal'};
      thisFlag = false;
    });
  });
  describe('given the _stuff_ is INVALID', () => {
    let things, thisOtherFlag;
    beforeEach(() => { 
      things = Object.assign({},stuff);
      thisOtherFlag = true;

      randomApi.mockImplementation(()=>({data:things, thisOtherFlag}));
    });
    describe('when called', () => {
      let result;
      beforeEach(() => { 
        result = copmplexCondition(stuff, thisFlag);
      });
      it('then DO the thing', () => {
        expect(doTheThing).toBeCalled();
      });
    });
  });
  describe('given the _stuff_ is VALID', () => {
    let things, thisOtherFlag;
  beforeEach(() => { 
    things = {};
    thisOtherFlag = false;

    randomApi.mockImplementation(()=>({data:things, thisOtherFlag}));
  });
  describe('when called', () => {
    let result;
    beforeEach(() => { 
      result = copmplexCondition(stuff, thisFlag);
    });
    it('then do NOT do the thing', () => {
      expect(doTheThing).not.toBeCalled();
    });
  });
});
});