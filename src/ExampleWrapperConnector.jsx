import { connect } from 'react-redux';
import ContainerCardsWrapper from './ContainerCardsWrapper';
import { getInvalidItemsCount } from '../../../selectors/getInvalidItemsCount';

const mapStateToProps = ({ estimateBuilder }) => {
  const { entities, uiState } = estimateBuilder;

  const invalidItemsCount = getInvalidItemsCount(entities, uiState.selectedEstimate);

  return {
    invalidItemsCount,
  };
};

export default connect(mapStateToProps)(ContainerCardsWrapper);
