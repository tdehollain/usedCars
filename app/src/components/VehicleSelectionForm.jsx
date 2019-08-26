import React, { Component } from 'react';
// import MySelect from './MySelect';

export default class VehicleSelectionForm extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.selectedVehicle === this.props.selectedVehicle && nextProps.vehicleList.length === this.props.vehicleList.length) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    // console.log('Rendering VehicleSelectionForm');
    return (
      <form>
        <label className="pt-label">
          Vehicle
          <div className="pt-select">
            <select className="pt-select" value={this.props.selectedVehicle} onChange={this.props.changeSelectedVehicle}>
              <option />
              {this.props.vehicleList.map(el => (
                <option key={el.title}>{el.title}</option>
              ))}
            </select>
            {/* <MySelect
            items={this.props.vehicleList.map(el => el.title)}
            selectedItem={this.props.selectedVehicle}
            onItemSelect={this.props.changeSelectedVehicle}
            allowCreate={false}
            filterable={true}
            width={300}
          /> */}
          </div>
        </label>
      </form>
    );
  }
}
