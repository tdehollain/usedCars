import React, { Component } from 'react';
import { Button, AnchorButton, Label } from '@blueprintjs/core';

export default class AddVehicleForm extends Component {
	render() {
		return (
			<form onSubmit={this.props.submitForm}>
				<div className='form-header'>
					<p>Add a new vehicle</p>
				</div>
				<section className='form-top'>
					<Label text='Title' helperText='(required)'>
						<input className='pt-input' id='title' type='text' placeholder='Enter a title' value={this.props.vehicle.title} onChange={this.props.changeValue} />
					</Label>
				</section>
				<div className='form-columns'>
					<section className='form-left'>
						<Label text='Brand' helperText='(required)'>
							<input className='pt-input' id='brand' type='text' placeholder='Brand' value={this.props.vehicle.brand} onChange={this.props.changeValue} />
						</Label>
						<Label text='Model' helperText='(required)'>
							<input className='pt-input' id='model' type='text' placeholder='Model' value={this.props.vehicle.model} onChange={this.props.changeValue} />
						</Label>
						<Label text='Version'>
							<input className='pt-input' id='version' type='text' placeholder='e.g. GTS' value={this.props.vehicle.version || ''} onChange={this.props.changeValue} />
						</Label>
					</section>
					<section className='form-right'>
						<Label text='First registration' helperText='(from required)'></Label>
						<div className='pt-control-group'>
							<input className='pt-input' id='regFrom' type='text' placeholder='from (required)' value={this.props.vehicle.regFrom || ''} onChange={this.props.changeValue} />
							<input className='pt-input' id='regTo' type='text' placeholder='to' value={this.props.vehicle.regTo || ''} onChange={this.props.changeValue} />
						</div>
						<Label text='Power'></Label>
						<div className='pt-control-group'>
							<input className='pt-input' id='chFrom' type='text' placeholder='from' value={this.props.vehicle.chFrom || ''} onChange={this.props.changeValue} />
							<input className='pt-input' id='chTo' type='text' placeholder='to' value={this.props.vehicle.chTo || ''} onChange={this.props.changeValue} />
						</div>
						<Label text='Number of doors'></Label>
						<div className='pt-control-group'>
							<input className='pt-input' id='doorsFrom' type='text' placeholder='from' value={this.props.vehicle.doorsFrom || ''} onChange={this.props.changeValue} />
							<input className='pt-input' id='doorsTo' type='text' placeholder='to' value={this.props.vehicle.doorsTo || ''} onChange={this.props.changeValue} />
						</div>
					</section>
				</div>
				<div className='form-bottom'>
					<section className=''>
						<Label text='Transmission'></Label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' id='checkedTransAuto' checked={this.props.vehicle.checkedTransAuto} onChange={this.props.changeValue} />
							<span className='pt-control-indicator'></span>
							Automatic
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' id='checkedTransMan' checked={this.props.vehicle.checkedTransMan} onChange={this.props.changeValue} />
							<span className='pt-control-indicator'></span>
							Manual
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' id='checkedTransSemi' checked={this.props.vehicle.checkedTransSemi} onChange={this.props.changeValue} />
							<span className='pt-control-indicator'></span>
							Semi-automatic
						</label>
					</section>
					<section className=''>
						<Label text='Fuel type'></Label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' id='checkedFuelPetrol' checked={this.props.vehicle.checkedFuelPetrol} onChange={this.props.changeValue} />
							<span className='pt-control-indicator'></span>
							Petrol
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' id='checkedFuelDiesel' checked={this.props.vehicle.checkedFuelDiesel} onChange={this.props.changeValue} />
							<span className='pt-control-indicator'></span>
							Diesel
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' id='checkedFuelElec' checked={this.props.vehicle.checkedFuelElec} onChange={this.props.changeValue} />
							<span className='pt-control-indicator'></span>
							Electric
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' id='checkedFuelElecPetrol' checked={this.props.vehicle.checkedFuelElecPetrol} onChange={this.props.changeValue} />
							<span className='pt-control-indicator'></span>
							Electric-Petrol
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' id='checkedFuelElecDiesel' checked={this.props.vehicle.checkedFuelElecDiesel} onChange={this.props.changeValue} />
							<span className='pt-control-indicator'></span>
							Electric-Diesel
						</label>
					</section>
					<section className=''>
						<Label text='Body type'></Label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' id='checkedBodyCompact' checked={this.props.vehicle.checkedBodyCompact} onChange={this.props.changeValue} />
							<span className='pt-control-indicator'></span>
							Compact
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' id='checkedBodyConvertible' checked={this.props.vehicle.checkedBodyConvertible} onChange={this.props.changeValue} />
							<span className='pt-control-indicator'></span>
							Convertible
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' id='checkedBodyCoupe' checked={this.props.vehicle.checkedBodyCoupe} onChange={this.props.changeValue} />
							<span className='pt-control-indicator'></span>
							Coupe
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' id='checkedBodySUV' checked={this.props.vehicle.checkedBodySUV} onChange={this.props.changeValue} />
							<span className='pt-control-indicator'></span>
							SUV/Off-Road
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' id='checkedBodySedan' checked={this.props.vehicle.checkedBodySedan} onChange={this.props.changeValue} />
							<span className='pt-control-indicator'></span>
							Sedan
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' id='checkedBodySW' checked={this.props.vehicle.checkedBodySW} onChange={this.props.changeValue} />
							<span className='pt-control-indicator'></span>
							Station Wagon
						</label>
					</section>
				</div>
				<div className='form-submit'>
					<AnchorButton icon='comparison' className='pt-large' text='Test' href={this.props.vehicle.vehicleURL} target='_blank' />
					{this.props.editMode ?
						<Button type='submit' icon='edit' className='pt-large' text='Edit vehicle' /> :
						<Button type='submit' icon='add' className='pt-large' text='Create vehicle' />
					}
				</div>
			</form>
		)
	}
}