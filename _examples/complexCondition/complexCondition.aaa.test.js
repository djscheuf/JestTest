import complexCondition from './complexCondition';

import doTheThing from './somewhere/doTheThing';
jest.mock('./somewhere/doTheThing');

import randomApi from './somewhereElse/randomApi';
jest.mock('./somewhereElse/randomApi');

describe('Complex Condition', () => {
  it('should doTheThing', () => { 
    const stuff = {prop:'value',otherProp:'anotherVal'};
    const thisFlag = false;
    randomApi.mockImplementation(()=>({data:stuff, thisOtherFlag: !thisFlag}));

    const result = complexCondition(stuff, thisFlag);

    expect(doTheThing).toBeCalled();
  });

  it('should NOT doTheThing ', () => { 
    const stuff = {prop:'value',otherProp:'anotherVal'};
    const thisFlag = false;
    randomApi.mockImplementation(()=>({data:{}, thisOtherFlag: thisFlag}));

    const result = complexCondition(stuff, thisFlag);

    expect(doTheThing).not.toBeCalled();
  });
});

// space to do GWT