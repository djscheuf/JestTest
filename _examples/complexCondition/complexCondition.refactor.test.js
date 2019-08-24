import complexCondition from './complexCondition';

import doTheThing from './somewhere/doTheThing';
jest.mock('./somewhere/doTheThing');

import randomApi from './somewhereElse/randomApi';
jest.mock('./somewhereElse/randomApi');

import {
  stuffDidNotChange,
  getUniquePropValues,
  shouldValidateButFailed,
  moreUniqueValuesThanThereShouldBe
} from './complexCondition.support';
jest.mock('./complexCondition.support');

describe('Complex Condition', () => {
  describe('given stuff DID change', () => {
    beforeEach(() => { 
      stuffDidNotChange.mockImplementation (()=> false);
    });
    describe('given FEWER unique than expected', () => {
      beforeEach(() => { 
        getUniquePropValues.mockImplementation(()=> [1,2]);
        moreUniqueValuesThanThereShouldBe.mockImplementation(()=>false);
      });
      describe('given validation SUCCEEDED', () => {
        beforeEach(() => { 
          shouldValidateButFailed.mockImplementation(()=> false);
        });
        describe('when called', () => {
          beforeEach(() => { 
            complexCondition({},true);
          });
          it('then do NOT do the thing', () => { 
            expect(doTheThing).not.toBeCalled();
          });
        });
      });
      describe('given validation FAILED', () => {
        beforeEach(() => { 
          shouldValidateButFailed.mockImplementation(()=> true);
        });
        describe('when called', () => {
          beforeEach(() => { 
            complexCondition({},true);
          });
          it('then do NOT the thing', () => { 
            expect(doTheThing).not.toBeCalled();
          });
        });
      });
    });
    describe('given TOO MANY unique than expected', () => {
      beforeEach(() => { 
        getUniquePropValues.mockImplementation(()=> [1,2]);
        moreUniqueValuesThanThereShouldBe.mockImplementation(()=>false);
      });
      describe('given validation SUCCEEDED', () => {
        beforeEach(() => { 
          shouldValidateButFailed.mockImplementation(()=> false);
        });
        describe('when called', () => {
          beforeEach(() => { 
            complexCondition({},true);
          });
          it('then do NOT do the thing', () => { 
            expect(doTheThing).not.toBeCalled();
          });
        });
      });
      describe('given validation FAILED', () => {
        beforeEach(() => { 
          shouldValidateButFailed.mockImplementation(()=> true);
        });
        describe('when called', () => {
          beforeEach(() => { 
            complexCondition({},true);
          });
          it('then DO the thing', () => { 
            expect(doTheThing).toBeCalled();
          });
        });
      });
    });
  });
  describe('given stuff did NOT change', () => {
    beforeEach(() => { 
      stuffDidNotChange.mockImplementation (()=> false);
    });
    describe('when called', () => {
      beforeEach(() => { 
        complexCondition({},true);
      });
      it('then DO the thing', () => { 
        expect(doTheThing).toBeCalled();
      });
    });
  });  
});