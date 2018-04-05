import React, { Component } from 'react';
import { Icon } from '@blueprintjs/core';
import { Table, Column, Cell } from '@blueprintjs/table';

export default class VehicleList extends Component {

	render() {
		let rowHeights = this.props.vehicleList.map(el => {
			let numTrans = el.checkedTransAuto || 0 + el.checkedTransMan || 0 + el.checkedTransSemi;
			if(numTrans === 3) numTrans = 1;
			let numFuel = el.checkedFuelDiesel || 0 + el.checkedFuelElec || 0 + el.checkedFuelElecDiesel || 0 + el.checkedFuelElecPetrol || 0 + el.checkedFuelPetrol;
			if(numFuel === 5) numFuel = 1;
			let numBody = el.checkedBodyCompact || 0 + el.checkedBodyConvertible || 0 + el.checkedBodyCoupe || 0 + el.checkedBodySedan || 0 + el.checkedBodySUV || 0 + el.checkedBodySW;
			if(numBody === 6) numBody = 1;
			return 20*Math.max(numTrans, numFuel, numBody);
		});

		const cellRendererDeleteVehicle = row => {
			return <Cell><Icon className='deleteIcon' icon='trash' iconSize={12}  onClick={() => { this.props.deleteVehicle(this.props.vehicleList[row]._id) }}/></Cell>
		}

		const cellRendererTitle = row => <Cell wrapText tooltip={this.props.vehicleList[row].title || '-'}>{this.props.vehicleList[row].title || '-'}</Cell>;
		const cellRendererBrand = row => <Cell>{this.props.vehicleList[row].brand || '-'}</Cell>;
		const cellRendererModel = row => <Cell>{this.props.vehicleList[row].model || '-'}</Cell>;
		const cellRendererVersion = row => <Cell>{this.props.vehicleList[row].version || '-'}</Cell>;
		const cellRendererFirstReg = row => {
			let str = "";
			str+=this.props.vehicleList[row].regFrom + ' - ';
			if(this.props.vehicleList[row].regTo) str+=this.props.vehicleList[row].regTo;
			return <Cell>{str || '-'}</Cell>;
		}
		const cellRendererPower = row => {
			let str = "";
			if(this.props.vehicleList[row].chFrom) str+=this.props.vehicleList[row].chFrom + ' - ';
			if(this.props.vehicleList[row].chTo) str+=this.props.vehicleList[row].chTo;
			return <Cell>{str || '-'}</Cell>;
		}
		const cellRendererDoors = row =>  {
			let str = "";
			if(this.props.vehicleList[row].doorsFrom) str+=this.props.vehicleList[row].doorsFrom + ' - ';
			if(this.props.vehicleList[row].doorsTo) str+=this.props.vehicleList[row].doorsTo;
			return <Cell>{str || '-'}</Cell>;
		}
		const cellRendererTrans = row => {
			let str = [];
			if(this.props.vehicleList[row].checkedTransAuto) str.push("Automatic");
			if(this.props.vehicleList[row].checkedTransMan) str.push("Manual");
			if(this.props.vehicleList[row].checkedTransSemi) str.push("Semi-automatic");
			if(str.length === 3) str=['-'];
			return <Cell>{str.map((el, i) => <p key={i}>{el}</p>)}</Cell>
		}
		const cellRendererFuel = row =>  {
			let str = [];
			if(this.props.vehicleList[row].checkedFuelPetrol) str.push("Petrol");
			if(this.props.vehicleList[row].checkedFuelDiesel) str.push("Diesel");
			if(this.props.vehicleList[row].checkedFuelElec) str.push("Electric");
			if(this.props.vehicleList[row].checkedFuelElecPetrol) str.push("Petrol-Electric");
			if(this.props.vehicleList[row].checkedFuelElecDiesel) str.push("Diesel-Electric");
			if(str.length === 5) str=['-'];
			return <Cell>{str.map((el, i) => <p key={i}>{el}</p>)}</Cell>
		}
		const cellRendererBodyType = row =>  {
			let str = [];
			if(this.props.vehicleList[row].checkedBodyCompact) str.push("Compact");
			if(this.props.vehicleList[row].checkedBodyConvertible) str.push("Convertible");
			if(this.props.vehicleList[row].checkedBodyCoupe) str.push("Coupe");
			if(this.props.vehicleList[row].checkedBodySUV) str.push("SUV/Offroad");
			if(this.props.vehicleList[row].checkedBodySedan) str.push("Sedan");
			if(this.props.vehicleList[row].checkedBodySW) str.push("Station-wagon");
			if(str.length === 6) str=['-'];
			return <Cell>{str.map((el, i) => <p key={i}>{el}</p>)}</Cell>
		}

		const cellRendererTiming = row => {
			let th = 'th';
			if(this.props.vehicleList[row].timingDay === 1 || this.props.vehicleList[row].timingDay === 21) th = 'st';
			if(this.props.vehicleList[row].timingDay === 2 || this.props.vehicleList[row].timingDay === 22) th = 'nd';
			if(this.props.vehicleList[row].timingDay === 3 || this.props.vehicleList[row].timingDay === 23) th = 'rd';
			return <Cell>{this.props.vehicleList[row].timingDay}<sup>{th}</sup> - {this.props.vehicleList[row].timingHour}:10</Cell>
		}

		const cellRendererLastCount = row => {
			return <Cell><a href={this.props.vehicleList[row].vehicleURL || '#'} target='_blank'>{this.props.vehicleList[row].lastCount || '-'}</a></Cell>
		}
	
		return (
			<Table 
				className='vehicleList' 
				numRows={this.props.vehicleList.length} 
				columnWidths={[280, 70, 70, 100, 100, 100, 80, 110, 105, 105, 90, 90, 30]}
				rowHeights={rowHeights}
				enableColumnResizing={false}>
				<Column className='tile' name='Title' cellRenderer={cellRendererTitle} />
				<Column className='brand' name='Brand' cellRenderer={cellRendererBrand} />
				<Column className='model' name='Model' cellRenderer={cellRendererModel} />
				<Column className='version' name='Version' cellRenderer={cellRendererVersion} />
				<Column className='firstReg' name='Year' cellRenderer={cellRendererFirstReg} />
				<Column className='power' name='Power' cellRenderer={cellRendererPower} />
				<Column className='doors' name='# Doors' cellRenderer={cellRendererDoors} />
				<Column className='trans' name='Transmission' cellRenderer={cellRendererTrans} />
				<Column className='fuel' name='Fuel' cellRenderer={cellRendererFuel} />
				<Column className='bodyType' name='Body type' cellRenderer={cellRendererBodyType} />
				<Column className='timing' name='Timing' cellRenderer={cellRendererTiming} />
				<Column className='lastCount' name='Last count' cellRenderer={cellRendererLastCount} />
				<Column className='deleteVehicle' name='' cellRenderer={cellRendererDeleteVehicle} />
			</Table>
		)
	}
}