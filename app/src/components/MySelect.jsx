import React, { Component } from 'react';
import { MenuItem, Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

export default class MySelect extends Component {
  constructor() {
    super();
    this.state = {
      selectedItem: ''
    };

    // this.handleItemSelect = this.handleItemSelect.bind(this);
    this.createNewItemFromQuery = this.createNewItemFromQuery.bind(this);
  }

  itemRenderer(item, { handleClick, modifiers, query }) {
    return (
      // prettier-ignore
      <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        // label={item}
        key={item}
        onClick={handleClick}
        text={item}
      />
    );
  }

  itemPredicate(query, item, _index, exactMatch) {
    const normalizedDatasetName = item.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    if (exactMatch) {
      return normalizedDatasetName === normalizedQuery;
    } else {
      return normalizedDatasetName.indexOf(normalizedQuery) >= 0;
    }
  }

  createNewItemFromQuery(itemName) {
    this.props.handleItemCreate(itemName);
    return itemName;
  }

  createNewItemRenderer(query, active, handleClick) {
    return <MenuItem icon="add" text={`Create "${query}"`} active={active} onClick={handleClick} shouldDismissPopover={false} />;
  }

  render() {
    return (
      <Select
        items={this.props.items}
        itemPredicate={this.itemPredicate}
        itemRenderer={this.itemRenderer}
        onItemSelect={this.props.handleItemSelect}
        noResults={<MenuItem disabled={true} text="No results" />}
        createNewItemFromQuery={this.props.allowCreate && this.createNewItemFromQuery}
        createNewItemRenderer={this.props.allowCreate && this.createNewItemRenderer}
        // createNewItemFromQuery={this.createNewItemFromQuery}
        // createNewItemRenderer={this.createNewItemRenderer}
        popoverProps={{ minimal: true }}
        filterable={this.props.filterable || false}
      >
        <Button
          text={this.props.selectedItem}
          rightIcon="caret-down"
          style={{ width: this.props.width + 'px', display: 'flex', justifyContent: 'space-between' }}
        />
      </Select>
    );
  }
}
