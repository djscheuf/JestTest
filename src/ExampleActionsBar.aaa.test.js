/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import ItemActionsBar from './ItemActionsBar';
import DeleteItem from './DeleteItemConnector';
import EditItem from './EditItemConnector';
import SwapItem from './SwapItemConnector';
import CopyStyle from './CopyStyleConnector';
import DuplicateItem from './DuplicateItemConnector';

describe('ItemActionsBar', () => {
    it('if no product is selected and container contains only one item, it should not render', () => {
      const result = shallow(<ItemActionsBar {...{
        itemId: 'item',
        hasProduct: false,
        invalid: false,
        containerHasMultipleItems: false,
        canModifyItem: false,
      }} />);
      expect(result.type()).toBeNull();
    });
    it('if no product is selected and container has multiple items, it should only render DeleteItem', () => {
      const result = shallow(<ItemActionsBar {...{
        itemId: 'item',
      hasProduct: false,
      invalid: false,
      containerHasMultipleItems: true,
      canModifyItem: false,
      }} />);
      expect(result.find(DeleteItem).exists()).toBe(true);
      expect(result.find(EditItem).exists()).toBe(false);
      expect(result.find(SwapItem).exists()).toBe(false);
      expect(result.find(CopyStyle).exists()).toBe(false);
      expect(result.find(DuplicateItem).exists()).toBe(false);
    });
    it('if product is selected, it should render all actions', () => {
      const result = shallow(<ItemActionsBar {...{
        itemId: 'item',
        hasProduct: true,
        invalid: false,
        containerHasMultipleItems: false,
        canModifyItem: true,
      }} />);
      expect(result.find(DeleteItem).exists()).toBe(true);
      expect(result.find(EditItem).exists()).toBe(true);
      expect(result.find(SwapItem).exists()).toBe(true);
      expect(result.find(CopyStyle).exists()).toBe(true);
      expect(result.find(DuplicateItem).exists()).toBe(true);
    });
    it('if product is invalid, it should render all actions', () => {
      const result = shallow(<ItemActionsBar {...{
        itemId: 'item',
      hasProduct: true,
      invalid: true,
      containerHasMultipleItems: false,
      canModifyItem: true,
      }} />);
      expect(result.find(DeleteItem).exists()).toBe(true);
      expect(result.find(EditItem).exists()).toBe(true);
      expect(result.find(SwapItem).exists()).toBe(true);
      expect(result.find(CopyStyle).exists()).toBe(false);
      expect(result.find(DuplicateItem).exists()).toBe(false);
    });
});
