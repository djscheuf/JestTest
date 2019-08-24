import * as designBuilderApi from '../designBuilderApi';
import designLoaded from './designLoaded';
import designCopied from './designCopied';
import loaded from './loaded';
import loading from './loading';
import globalError from './globalError';
import saveToMyAccount from './saveToMyAccount';
import { designDuplicated } from '../analytics';

const exampleAction = newName => (dispatch, getState) => {
  dispatch(loading());
  const { uiState, entities } = getState().designBuilder;
  const { selectedThing } = uiState;
  const { items, designs } = entities;
  const originalDesignContainers = designs.byId[selectedThing].containers;

  return designBuilderApi
    .copyDesign(selectedThing, newName)
    .then((response) => {
      designDuplicated();
      const { design } = response.data;
      const containerMap = {};

      for (let idx = 0; idx < originalDesignContainers.length; idx += 1) {
        containerMap[originalDesignContainers[idx]] = design.containers[idx];
      }

      dispatch(designLoaded(response.data, items));
      dispatch(designCopied(selectedThing, design.designId, containerMap));
      dispatch(saveToMyAccount(design.designId));
      dispatch(loaded());
    })
    .catch(() => {
      dispatch(loaded());
      dispatch(globalError());
    });
};

export default exampleAction;
