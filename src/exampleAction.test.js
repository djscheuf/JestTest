/* eslint-env jest */

import * as designBuilderApi from '../designBuilderApi';
import exampleAction from './exampleAction';
import designLoaded from 'designLoaded';
import designCopied from 'designCopied';
import { designDuplicated } from '../analytics';
import loading from './loading';
import loaded from './loaded';

jest.mock('../designBuilderApi');
jest.mock('designLoaded');
jest.mock('designCopied');
jest.mock('../analytics');

describe('Copy Estimate action', () => {
  describe('Given an Estimate that can be copied', () => {
    let dispatchMock;
    let mockState = {};
    const getMockState = () => mockState;
    let givenDesignId;
    let givenContainerId;
    let nextDesignId;
    let nextContainerId;
    let nextDesign = {};
    const newName = 'BraveNewDeisgn';

    beforeAll(() => {
      givenDesignId = 'anotherUUID';
      givenContainerId = 'aContainerUUID';
      nextDesignId = 'someOtherUUID';
      nextContainerId = 'yetAnotherUUID';
      nextDesign = { design: { designId: nextDesignId, containers: [nextContainerId] } };

      dispatchMock = jest.fn();

      designBuilderApi.copyDesign.mockImplementation(() => Promise.resolve({ data: nextDesign }));

      mockState = {
        designBuilder: {
          entities: {
            designs: {
              byId: {
                [givenDesignId]: {
                  containers: [givenContainerId],
                },
              },
              allIds: [givenDesignId],
            },
            items: {},
          },
          uiState: {
            selectedThing: givenDesignId,
          },
        },
      };

      exampleAction(newName)(dispatchMock, getMockState);
    });

    it('should convey loading cycle to the user', () => {
      const dispatchCalls = dispatchMock.mock.calls.reduce((acc, b) => acc.concat(b), []);
      expect(dispatchCalls).toContainEqual(loading());
      expect(dispatchCalls).toContainEqual(loaded());
    });

    it('should perform copy action', () => {
      expect(designBuilderApi.copyDesign).toBeCalledWith(givenDesignId, newName);
    });

    it('should display newly created copy', () => {
      expect(designLoaded).toBeCalledWith(nextDesign, {});
    });

    it('should log the event for analytics', () => {
      expect(designDuplicated).toHaveBeenCalled();
    });

    it('should copy counts from original estimate', () => {
      expect(designCopied).toBeCalledWith(givenDesignId, nextDesignId, {
        [givenContainerId]: nextContainerId,
      });
    });
  });
});
