import React from 'react';
import PropTypes from 'prop-types';
import ContainerCard from './ContainerCardConnector';
import NewContainerButton from './NewContainerButtonConnector';
import ErrorCircleIcon from '../../../themes/svg/errorCircleIcon';

const ContainerCardsWrapper = props => (
  <div className="containerCards">
    {props.invalidItemsCount > 0 &&
      <div className="error"><ErrorCircleIcon />Please review and edit the highlighted products below.</div>
    }
    {props.containerIds.map((id, idx) => <ContainerCard containerId={id} key={id} index={idx} />)}
    <NewContainerButton />
  </div>
);

ContainerCardsWrapper.propTypes = {
  containerIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  invalidItemsCount: PropTypes.number.isRequired,
};

export default ContainerCardsWrapper;
