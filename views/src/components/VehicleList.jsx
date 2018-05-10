import React, { Component } from 'react';

export default class VehicleList extends Component {
	render() {

		return (
			<div className='vehicleListContainer'>
				<table className='vehicleList'>
					<tr>
						<th>#</th>
						<th>Title</th>
						<th>Brand</th>
						<th>Model</th>
						<th>Version</th>
						<th>Year</th>
						<th>Power</th>
						<th># Doors</th>
						<th>Transmission</th>
						<th>Fuel</th>
						<th>Body</th>
						<th>Timing</th>
						<th>Last count</th>
					</tr>
					{this.props.vehicleList.map((el, i) => {
						return (
							<tr>
								<td className='number'>{i+1}</td>
								<td className='title'>{el.title}</td>
								<td className='brand'>{el.brand}</td>
								<td className='model'>{el.model}</td>
								<td className='version'>{el.version}</td>
								<td className='year'>{el.regFrom} - {el.regTo}</td>
								<td className='power'>{el.chFrom} - {el.chTo}</td>
								<td className='doors'>{el.doorsFrom} - {el.doorsTo}</td>
								<td className='tranmission'>
									{(el.checkedTransAuto && 
									el.checkedTransMan && 
									el.checkedTransSemi) ?
									' - ' : 
									(el.checkedTransAuto ? 'Automatic; ' : '') + '; ' +
									(el.checkedTransMan ? 'Manual; ' : '') + '; ' +
									(el.checkedTransSemi ? 'Semi-automatic; ' : '')}
								</td>
								<td className='fuel'>
									{(el.checkedFuelPetrol && 
									el.checkedFuelDiesel && 
									el.checkedFuelElec && 
									el.checkedFuelElecPetrol && 
									el.checkedFuelElecDiesel) ?
									' - ' : 
									(el.checkedFuelPetrol ? 'Petrol; ' : '') +
									(el.checkedFuelDiesel ? 'Diesel; ' : '') +
									(el.checkedFuelElec ? 'Electric; ' : '') +
									(el.checkedFuelElecPetrol ? 'Petrol-electric; ' : '') +
									(el.checkedFuelElecDiesel ? 'Diesel-electric; ' : '')}
								</td>
								<td className='body'>
									{(el.checkedBodyCompact && 
									el.checkedBodyConvertible && 
									el.checkedBodyCoupe && 
									el.checkedBodySUV && 
									el.checkedBodySedan && 
									el.checkedBodySW) ?
									' - ' : 
									(el.checkedBodyCompact ? 'Compact; ' : '') +
									(el.checkedBodyConvertible ? 'Convertible; ' : '') +
									(el.checkedBodyCoupe ? 'Coupe; ' : '') +
									(el.checkedBodySUV ? 'SUV; ' : '') +
									(el.checkedBodySedan ? 'Sedan; ' : '') +
									(el.checkedBodySW ? 'SW; ' : '')}
								</td>
								<td>{el.timingDay}<sup>{el.timingDay===1 ? 'st' : el.timingDay===2 ? 'nd' : 'th'}</sup> - {el.timingHour}:10</td>
								<td className='lastCount'><a href={el.vehicleURL} target='_blank'>{el.lastCount}</a></td>
							</tr>
						)
					})}
				</table>
			</div>
		);
	}
}