export default (state, action) => {
  const { containerCount } = state;
  const { designId } = action.payload;

  const updatedContCount = {
    ...containerCount,
    [designId]: 0,
  };

  return {
    ...state,
    containerCount: updatedContCount,
  };
};
