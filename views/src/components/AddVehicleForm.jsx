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
						<input className='pt-input' id='title' type='text' placeholder='Enter a title' text={this.props.title} onChange={this.props.changeTitle}/>
					</Label>
				</section>
				<div className='form-columns'>
					<section className='form-left'>
						<Label text='Brand' helperText='(required)'>
							<input className='pt-input' id='brand' type='text' placeholder='Brand ID' onChange={this.props.changeBrand}/>
						</Label>
						<Label text='Model' helperText='(required)'>
							<input className='pt-input' id='model' type='text' placeholder='Model ID' onChange={this.props.changeModel}/>
						</Label>
						<Label text='Version'>
							<input className='pt-input' id='version' type='text' placeholder='e.g. GTS' onChange={this.props.changeVersion}/>
						</Label>
					</section>
					<section className='form-right'>
						<Label text='First registration' helperText='(from required)'></Label>
						<div className='pt-control-group'>
							<input className='pt-input' id='regFrom' type='text' placeholder='from (required)' onChange={this.props.changeRegFrom}/>
							<input className='pt-input' id='regTo' type='text' placeholder='to' onChange={this.props.changeRegTo}/>
						</div>
						<Label text='Power'></Label>
						<div className='pt-control-group'>
							<input className='pt-input' id='chFrom' type='text' placeholder='from' onChange={this.props.changeChFrom}/>
							<input className='pt-input' id='chTo' type='text' placeholder='to' onChange={this.props.changeChTo}/>
						</div>
						<Label text='Number of doors'></Label>
						<div className='pt-control-group'>
							<input className='pt-input' id='doorsFrom' type='text' placeholder='from' onChange={this.props.changeDoorsFrom}/>
							<input className='pt-input' id='doorsTo' type='text' placeholder='to' onChange={this.props.changeDoorsTo}/>
						</div>
					</section>
				</div>
				<div className='form-bottom'>
					<section className=''>
						<Label text='Transmission'></Label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' checked={this.props.checkedTransAuto} onChange={this.props.changeTransAuto}/>
							<span className='pt-control-indicator'></span>
							Automatic
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' checked={this.props.checkedTransMan} onChange={this.props.changeTransMan}/>
							<span className='pt-control-indicator'></span>
							Manual
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' checked={this.props.checkedTransSemi} onChange={this.props.changeTransSemi}/>
							<span className='pt-control-indicator'></span>
							Semi-automatic
						</label>
					</section>
					<section className=''>
						<Label text='Fuel type'></Label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' checked={this.props.checkedFuelPetrol} onChange={this.props.changeFuelPetrol}/>
							<span className='pt-control-indicator'></span>
							Petrol
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' checked={this.props.checkedFuelDiesel} onChange={this.props.changeFuelDiesel}/>
							<span className='pt-control-indicator'></span>
							Diesel
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' checked={this.props.checkedFuelElec} onChange={this.props.changeFuelElec}/>
							<span className='pt-control-indicator'></span>
							Electric
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' checked={this.props.checkedFuelElecPetrol} onChange={this.props.changeFuelElecPetrol}/>
							<span className='pt-control-indicator'></span>
							Electric-Petrol
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' checked={this.props.checkedFuelElecDiesel} onChange={this.props.changeFuelElecDiesel}/>
							<span className='pt-control-indicator'></span>
							Electric-Diesel
						</label>
					</section>
					<section className=''>
						<Label text='Body type'></Label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' checked={this.props.checkedBodyConvertible} onChange={this.props.changeBodyConvertible}/>
							<span className='pt-control-indicator'></span>
							Convertible
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' checked={this.props.checkedBodyCoupe} onChange={this.props.changeBodyCoupe}/>
							<span className='pt-control-indicator'></span>
							Coupe
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' checked={this.props.checkedBodySUV} onChange={this.props.changeBodySUV}/>
							<span className='pt-control-indicator'></span>
							SUV/Off-Road
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' checked={this.props.checkedBodySedan} onChange={this.props.changeBodySedan}/>
							<span className='pt-control-indicator'></span>
							Sedan
						</label>
						<label className='pt-control pt-checkbox'>
							<input type='checkbox' checked={this.props.checkedBodySW} onChange={this.props.changeBodySW}/>
							<span className='pt-control-indicator'></span>
							Station Wagon
						</label>
					</section>
				</div>
				<div className='form-submit'>
					<AnchorButton icon='comparison' className='pt-large' text='Test' href={this.props.vehicleURL} target='_blank' />
					<Button type='submit' icon='add' className='pt-large' text='Create vehicle' />
				</div>
			</form>
		)
	}
}