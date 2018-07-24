/* eslint-env jest */

import exampleReducer from './exampleReducer';
import { RESET_CONTAINER_COUNT } from '../../actions/actionTypes';

describe('resetContainerCount reducer', () => {
  const designId = 'some-guid';
  const otherDesignId = 'some-other-guid';

  const state = {
    containerCount: {
      [designId]: 5,
      [otherDesignId]: 3,
    },
  };

  const action = {
    type: RESET_CONTAINER_COUNT,
    payload: {
      designId,
    },
  };

  const result = exampleReducer(state, action);

  it('should set container count to 0 for the given designId', () => {
    expect(result.containerCount[designId]).toBe(0);
  });

  it('should not modify container count for other designs', () => {
    expect(result.containerCount[otherDesignId]).toBe(3);
  });

  it('should not mutate state', () => {
    expect(result).not.toBe(state);
    expect(result.containerCount).not.toBe(state.containerCount);
  });
});
s