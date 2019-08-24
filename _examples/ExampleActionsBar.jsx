import React from 'react';
import PropTypes from 'prop-types';
import DeleteItem from './DeleteItemConnector';
import EditItem from './EditItemConnector';
import SwapItem from './SwapItemConnector';
import CopyFromItem from 'CopyFromConnector';
import DuplicateItem from './DuplicateItemConnector';

const ExampleActionsBar = ({
  itemId,
  hasProduct,
  invalid,
  containerHasMultipleItems,
  canModifyItem,
}) => {
  if (hasProduct || containerHasMultipleItems) {
    return (
      <div>
        <div className="itemActionsBar">
          {canModifyItem ? <EditItem itemId={itemId} /> : null}
          {canModifyItem ? <SwapItem itemId={itemId} /> : null}
          {canModifyItem && !invalid ? <CopyFromItem itemId={itemId} /> : null}
          {canModifyItem && !invalid ? <DuplicateItem itemId={itemId} /> : null}
          <DeleteItem itemId={itemId} />
        </div>
      </div>
    );
  }
  return null;
};

ExampleActionsBar.propTypes = {
  itemId: PropTypes.string.isRequired,
  hasProduct: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  containerHasMultipleItems: PropTypes.bool.isRequired,
  canModifyItem: PropTypes.bool.isRequired,
};

export default ExampleActionsBar;
