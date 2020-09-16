import React from 'react';
import { Icon } from '@blueprintjs/core';

const VehicleList = (props) => {
  const trimText = (text) => {
    let output = text.trim();
    if (output.slice(-1) === ';') output = output.slice(0, -1);
    return output;
  };

  return (
    <div className="vehicleListContainer">
      <table className="vehicleList">
        <thead>
          <tr>
            <th>#</th>
            <th>
              Title
              <input
                className="pt-input"
                id="searchTerm"
                type="text"
                placeholder="Search"
                text={props.searchTerm}
                onChange={props.handleChangeSearchTerm}
              />
            </th>
            <th>Brand</th>
            <th>Model</th>
            <th>Version</th>
            <th>Year</th>
            <th>Power</th>
            <th>Doors</th>
            <th>Trans.</th>
            <th>Fuel</th>
            <th>Body</th>
            <th>Timing</th>
            <th>Count</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {props.vehicleList
            && props.vehicleList.map((el, i) => (
              <tr key={i}>
                <td className="number">{i + 1}</td>
                <td className="title">
                  {el.title}
                  <span
                    className="editVehicle"
                    onClick={() => {
                      props.editVehicle(el);
                    }}
                  >
                    <Icon className="editIcon" icon="edit" iconSize={12} />
                  </span>
                </td>
                <td className="brand">{el.brand}</td>
                <td className="model">{el.model}</td>
                <td className="version">{el.version}</td>
                <td className="year">
                  {el.regFrom}
                  {' '}
                  -
                  {el.regTo}
                </td>
                <td className="power">
                  {el.chFrom}
                  {' '}
                  -
                  {el.chTo}
                </td>
                <td className="doors">
                  {el.doorsFrom}
                  {' '}
                  -
                  {el.doorsTo}
                </td>
                <td className="tranmission">
                  {trimText(
                    el.checkedTransAuto && el.checkedTransMan && el.checkedTransSemi
                      ? ' - '
                      : (el.checkedTransAuto ? 'Automatic; ' : '')
                            + (el.checkedTransMan ? 'Manual; ' : '')
                            + (el.checkedTransSemi ? 'Semi-automatic' : ''),
                  )}
                </td>
                <td className="fuel">
                  {trimText(
                    el.checkedFuelPetrol
                        && el.checkedFuelDiesel
                        && el.checkedFuelElec
                        && el.checkedFuelElecPetrol
                        && el.checkedFuelElecDiesel
                      ? ' - '
                      : (el.checkedFuelPetrol ? 'Petrol; ' : '')
                            + (el.checkedFuelDiesel ? 'Diesel; ' : '')
                            + (el.checkedFuelElec ? 'Electric; ' : '')
                            + (el.checkedFuelElecPetrol ? 'Petrol-electric; ' : '')
                            + (el.checkedFuelElecDiesel ? 'Diesel-electric' : ''),
                  )}
                </td>
                <td className="body">
                  {trimText(
                    el.checkedBodyCompact
                        && el.checkedBodyConvertible
                        && el.checkedBodyCoupe
                        && el.checkedBodySUV
                        && el.checkedBodySedan
                        && el.checkedBodySW
                      ? ' - '
                      : (el.checkedBodyCompact ? 'Compact; ' : '')
                            + (el.checkedBodyConvertible ? 'Convertible; ' : '')
                            + (el.checkedBodyCoupe ? 'Coupe; ' : '')
                            + (el.checkedBodySUV ? 'SUV; ' : '')
                            + (el.checkedBodySedan ? 'Sedan; ' : '')
                            + (el.checkedBodySW ? 'SW' : ''),
                  )}
                </td>
                <td className="timing">
                  {el.timingDay}
                  <sup>{el.timingDay === 1 ? 'st' : el.timingDay === 2 ? 'nd' : 'th'}</sup>
                  {' '}
                  -
                  {el.timingHour}
                  :10
                </td>
                <td className="lastCount">
                  <a href={el.vehicleURL} target="_blank" rel="noopener noreferrer">
                    {el.lastCount}
                  </a>
                </td>
                <td className="delete">
                  <Icon
                    className="deleteIcon"
                    icon="trash"
                    iconSize={12}
                    onClick={() => {
                      props.deleteVehicle(el.title);
                    }}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleList;
