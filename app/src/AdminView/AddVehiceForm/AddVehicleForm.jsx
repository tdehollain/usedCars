import React from 'react';
import { Button, AnchorButton, Label } from '@blueprintjs/core';

const AddVehicleForm = props => (
  <form onSubmit={props.submitForm}>
    <div className="form-header">
      <p>Add a new vehicle</p>
    </div>
    <section className="form-top">
      <Label text="Title" helperText="(required)">
        <input
          className="pt-input"
          id="title"
          type="text"
          placeholder="Enter a title"
          value={props.vehicle.title}
          onChange={props.changeValue}
        />
      </Label>
    </section>
    <div className="form-columns">
      <section className="form-left">
        <Label text="Brand" helperText="(required)">
          <input className="pt-input" id="brand" type="text" placeholder="Brand" value={props.vehicle.brand} onChange={props.changeValue} />
        </Label>
        <Label text="Model" helperText="(required)">
          <input className="pt-input" id="model" type="text" placeholder="Model" value={props.vehicle.model} onChange={props.changeValue} />
        </Label>
        <Label text="Version">
          <input
            className="pt-input"
            id="version"
            type="text"
            placeholder="e.g. GTS"
            value={props.vehicle.version || ''}
            onChange={props.changeValue}
          />
        </Label>
      </section>
      <section className="form-right">
        <Label text="First registration" helperText="(from required)" />
        <div className="pt-control-group">
          <input
            className="pt-input"
            id="regFrom"
            type="text"
            placeholder="from (required)"
            value={props.vehicle.regFrom || ''}
            onChange={props.changeValue}
          />
          <input
            className="pt-input"
            id="regTo"
            type="text"
            placeholder="to"
            value={props.vehicle.regTo || ''}
            onChange={props.changeValue}
          />
        </div>
        <Label text="Power" />
        <div className="pt-control-group">
          <input
            className="pt-input"
            id="chFrom"
            type="text"
            placeholder="from"
            value={props.vehicle.chFrom || ''}
            onChange={props.changeValue}
          />
          <input
            className="pt-input"
            id="chTo"
            type="text"
            placeholder="to"
            value={props.vehicle.chTo || ''}
            onChange={props.changeValue}
          />
        </div>
        <Label text="Number of doors" />
        <div className="pt-control-group">
          <input
            className="pt-input"
            id="doorsFrom"
            type="text"
            placeholder="from"
            value={props.vehicle.doorsFrom || ''}
            onChange={props.changeValue}
          />
          <input
            className="pt-input"
            id="doorsTo"
            type="text"
            placeholder="to"
            value={props.vehicle.doorsTo || ''}
            onChange={props.changeValue}
          />
        </div>
      </section>
    </div>
    <div className="form-bottom">
      <section className="">
        <Label text="Transmission" />
        <label className="pt-control pt-checkbox">
          <input type="checkbox" id="checkedTransAuto" checked={props.vehicle.checkedTransAuto} onChange={props.changeValue} />
          <span className="pt-control-indicator" />
          Automatic
        </label>
        <label className="pt-control pt-checkbox">
          <input type="checkbox" id="checkedTransMan" checked={props.vehicle.checkedTransMan} onChange={props.changeValue} />
          <span className="pt-control-indicator" />
          Manual
        </label>
        <label className="pt-control pt-checkbox">
          <input type="checkbox" id="checkedTransSemi" checked={props.vehicle.checkedTransSemi} onChange={props.changeValue} />
          <span className="pt-control-indicator" />
          Semi-automatic
        </label>
      </section>
      <section className="">
        <Label text="Fuel type" />
        <label className="pt-control pt-checkbox">
          <input type="checkbox" id="checkedFuelPetrol" checked={props.vehicle.checkedFuelPetrol} onChange={props.changeValue} />
          <span className="pt-control-indicator" />
          Petrol
        </label>
        <label className="pt-control pt-checkbox">
          <input type="checkbox" id="checkedFuelDiesel" checked={props.vehicle.checkedFuelDiesel} onChange={props.changeValue} />
          <span className="pt-control-indicator" />
          Diesel
        </label>
        <label className="pt-control pt-checkbox">
          <input type="checkbox" id="checkedFuelElec" checked={props.vehicle.checkedFuelElec} onChange={props.changeValue} />
          <span className="pt-control-indicator" />
          Electric
        </label>
        <label className="pt-control pt-checkbox">
          <input type="checkbox" id="checkedFuelElecPetrol" checked={props.vehicle.checkedFuelElecPetrol} onChange={props.changeValue} />
          <span className="pt-control-indicator" />
          Electric-Petrol
        </label>
        <label className="pt-control pt-checkbox">
          <input type="checkbox" id="checkedFuelElecDiesel" checked={props.vehicle.checkedFuelElecDiesel} onChange={props.changeValue} />
          <span className="pt-control-indicator" />
          Electric-Diesel
        </label>
      </section>
      <section className="">
        <Label text="Body type" />
        <label className="pt-control pt-checkbox">
          <input type="checkbox" id="checkedBodyCompact" checked={props.vehicle.checkedBodyCompact} onChange={props.changeValue} />
          <span className="pt-control-indicator" />
          Compact
        </label>
        <label className="pt-control pt-checkbox">
          <input type="checkbox" id="checkedBodyConvertible" checked={props.vehicle.checkedBodyConvertible} onChange={props.changeValue} />
          <span className="pt-control-indicator" />
          Convertible
        </label>
        <label className="pt-control pt-checkbox">
          <input type="checkbox" id="checkedBodyCoupe" checked={props.vehicle.checkedBodyCoupe} onChange={props.changeValue} />
          <span className="pt-control-indicator" />
          Coupe
        </label>
        <label className="pt-control pt-checkbox">
          <input type="checkbox" id="checkedBodySUV" checked={props.vehicle.checkedBodySUV} onChange={props.changeValue} />
          <span className="pt-control-indicator" />
          SUV/Off-Road
        </label>
        <label className="pt-control pt-checkbox">
          <input type="checkbox" id="checkedBodySedan" checked={props.vehicle.checkedBodySedan} onChange={props.changeValue} />
          <span className="pt-control-indicator" />
          Sedan
        </label>
        <label className="pt-control pt-checkbox">
          <input type="checkbox" id="checkedBodySW" checked={props.vehicle.checkedBodySW} onChange={props.changeValue} />
          <span className="pt-control-indicator" />
          Station Wagon
        </label>
      </section>
    </div>
    <div className="form-submit">
      <AnchorButton icon="comparison" className="pt-large" text="Test" href={props.vehicle.vehicleURL} target="_blank" />
      {props.editMode ? (
        <Button type="submit" icon="edit" className="pt-large" text="Edit vehicle" />
      ) : (
        <Button type="submit" icon="add" className="pt-large" text="Create vehicle" />
      )}
    </div>
  </form>
);

export default AddVehicleForm;
