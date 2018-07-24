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
  describe('no product is selected and container contains only one item', () => {
    const props = {
      itemId: 'item',
      hasProduct: false,
      invalid: false,
      containerHasMultipleItems: false,
      canModifyItem: false,
    };
    it('should not render', () => {
      const result = shallow(<ItemActionsBar {...props} />);
      expect(result.type()).toBeNull();
    });
  });
  describe('no product is selected and container has multiple items', () => {
    const props = {
      itemId: 'item',
      hasProduct: false,
      invalid: false,
      containerHasMultipleItems: true,
      canModifyItem: false,
    };
    it('should only render DeleteItem', () => {
      const result = shallow(<ItemActionsBar {...props} />);
      expect(result.find(DeleteItem).exists()).toBe(true);
      expect(result.find(EditItem).exists()).toBe(false);
      expect(result.find(SwapItem).exists()).toBe(false);
      expect(result.find(CopyStyle).exists()).toBe(false);
      expect(result.find(DuplicateItem).exists()).toBe(false);
    });
  });
  describe('product is selected', () => {
    const props = {
      itemId: 'item',
      hasProduct: true,
      invalid: false,
      containerHasMultipleItems: false,
      canModifyItem: true,
    };
    it('should render all actions', () => {
      const result = shallow(<ItemActionsBar {...props} />);
      expect(result.find(DeleteItem).exists()).toBe(true);
      expect(result.find(EditItem).exists()).toBe(true);
      expect(result.find(SwapItem).exists()).toBe(true);
      expect(result.find(CopyStyle).exists()).toBe(true);
      expect(result.find(DuplicateItem).exists()).toBe(true);
    });
  });
  describe('product is invalid', () => {
    const props = {
      itemId: 'item',
      hasProduct: true,
      invalid: true,
      containerHasMultipleItems: false,
      canModifyItem: true,
    };
    it('should render all actions', () => {
      const result = shallow(<ItemActionsBar {...props} />);
      expect(result.find(DeleteItem).exists()).toBe(true);
      expect(result.find(EditItem).exists()).toBe(true);
      expect(result.find(SwapItem).exists()).toBe(true);
      expect(result.find(CopyStyle).exists()).toBe(false);
      expect(result.find(DuplicateItem).exists()).toBe(false);
    });
  });
});
