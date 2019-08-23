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
  describe('Given NO product is selected and container contains ONLY ONE item', () => {
    let props;
    beforeEach(() => { 
      props = {
        itemId: 'item',
        hasProduct: false,
        invalid: false,
        containerHasMultipleItems: false,
        canModifyItem: false,
      };
    });
    describe('when rendered', () => {
      let result;
      beforeEach(() => { 
        result = shallow(<ItemActionsBar {...props} />);
      });
      it('should not render', () => {
        expect(result.type()).toBeNull();
      });
    });
  });
  describe('Given NO product is selected and container has MULTIPLE items', () => {
    let props;
    beforeEach(() => { 
      props = {
        itemId: 'item',
        hasProduct: false,
        invalid: false,
        containerHasMultipleItems: true,
        canModifyItem: false,
      };
    });
    describe('when rendered', () => {
      let result;
      beforeEach(() => { 
        result = shallow(<ItemActionsBar {...props} />);
      });
      it('should ONLY render DeleteItem', () => {
        expect(result.find(DeleteItem).exists()).toBe(true);
        expect(result.find(EditItem).exists()).toBe(false);
        expect(result.find(SwapItem).exists()).toBe(false);
        expect(result.find(CopyStyle).exists()).toBe(false);
        expect(result.find(DuplicateItem).exists()).toBe(false);
      });
    });
    
  });
  describe('Given product is SELECTED', () => {
    let props;
    beforeEach(() => { 
      props = {
        itemId: 'item',
        hasProduct: true,
        invalid: false,
        containerHasMultipleItems: false,
        canModifyItem: true,
      };
    });
    describe('when rendered', () => {
      let result;
      beforeEach(() => { 
        result = shallow(<ItemActionsBar {...props} />);
      });
      it('should render ALL actions', () => {
        expect(result.find(DeleteItem).exists()).toBe(true);
        expect(result.find(EditItem).exists()).toBe(true);
        expect(result.find(SwapItem).exists()).toBe(true);
        expect(result.find(CopyStyle).exists()).toBe(true);
        expect(result.find(DuplicateItem).exists()).toBe(true);
      });
    });
    
    
  });
  describe('Given product is INVALID', () => {
    let props;
    beforeEach(() => { 
      props = {
        itemId: 'item',
        hasProduct: true,
        invalid: true,
        containerHasMultipleItems: false,
        canModifyItem: true,
      };
    });
    describe('when rendered', () => {
      let result;
      beforeEach(() => { 
        result = shallow(<ItemActionsBar {...props} />);
      });
      it('should render ALL actions', () => {
        expect(result.find(DeleteItem).exists()).toBe(true);
        expect(result.find(EditItem).exists()).toBe(true);
        expect(result.find(SwapItem).exists()).toBe(true);
        expect(result.find(CopyStyle).exists()).toBe(false);
        expect(result.find(DuplicateItem).exists()).toBe(false);
      });
    });
    
  });
});
