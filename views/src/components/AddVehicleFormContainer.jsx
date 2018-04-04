import React, { Component } from 'react';
import { store } from '../store';
import AddVehicleForm from './AddVehicleForm';
import buildURL from '../lib/util';

export default class AddVehicleFormContainer extends Component {
	constructor() {
		super();
		this.state = {
			checkedTransAuto: true,
			checkedTransMan: true,
			checkedTransSemi: true,
			checkedFuelPetrol: true,
			checkedFuelDiesel: true,
			checkedFuelElec: true,
			checkedFuelElecPetrol: true,
			checkedFuelElecDiesel: true,
			checkedBodyConvertible: true,
			checkedBodyCoupe: true,
			checkedBodySUV: true,
			checkedBodySedan: true,
			checkedBodySW: true,
			vehicleURL: `https://www.autoscout24.com/results`
		};
		this.changeTitle = this.changeTitle.bind(this);
		this.changeBrand = this.changeBrand.bind(this);
		this.changeModel = this.changeModel.bind(this);
		this.changeVersion = this.changeVersion.bind(this);
		this.changeRegFrom = this.changeRegFrom.bind(this);
		this.changeRegTo = this.changeRegTo.bind(this);
		this.changeChFrom = this.changeChFrom.bind(this);
		this.changeChTo = this.changeChTo.bind(this);
		this.changeDoorsFrom = this.changeDoorsFrom.bind(this);
		this.changeDoorsTo = this.changeDoorsTo.bind(this);
		this.changeTransAuto = this.changeTransAuto.bind(this);
		this.changeTransMan = this.changeTransMan.bind(this);
		this.changeTransSemi = this.changeTransSemi.bind(this);
		this.changeFuelPetrol = this.changeFuelPetrol.bind(this);
		this.changeFuelDiesel = this.changeFuelDiesel.bind(this);
		this.changeFuelElec = this.changeFuelElec.bind(this);
		this.changeFuelElecPetrol = this.changeFuelElecPetrol.bind(this);
		this.changeFuelElecDiesel = this.changeFuelElecDiesel.bind(this);
		this.changeBodyConvertible = this.changeBodyConvertible.bind(this);
		this.changeBodyCoupe = this.changeBodyCoupe.bind(this);
		this.changeBodySUV = this.changeBodySUV.bind(this);
		this.changeBodySedan = this.changeBodySedan.bind(this);
		this.changeBodySW = this.changeBodySW.bind(this);
		this.handleSubmitForm = this.handleSubmitForm.bind(this);
	}

	async handleSubmitForm(e) {
		e.preventDefault();

		if(!this.validateForm()) return;

		fetch('/api/post/', {
			"method": "POST",
			"body": JSON.stringify({...this.state, dateAdded: new Date() }),
			"headers": {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		})
		.then(res => res.json())
		.then(res => {	
			if(res.success) {
				store.dispatch({
					type: "ADD_VEHICLE",
					vehicle: {...this.state, dateAdded: new Date(), _id: res.id, timingDay: res.timingDay, timingHour: res.timingHour }
				});
			} else {
				alert('A vehicle with this title already exists');
			}
		});
	}

	validateForm() {
		return (this.state.title && this.state.brand && this.state.model && this.state.regFrom);
	}

	changeTitle(e) { this.setState({ title: e.target.value }, () => { this.updateVehicleURL(); }) }
	changeBrand(e) { this.setState({ brand: e.target.value }, () => { this.updateVehicleURL(); }) }
	changeModel(e) { this.setState({ model: e.target.value }, () => { this.updateVehicleURL(); }) }
	changeVersion(e) { this.setState({ version: e.target.value }, () => { this.updateVehicleURL(); }) }
	changeRegFrom(e) { this.setState({ regFrom: e.target.value }, () => { this.updateVehicleURL(); }) }
	changeRegTo(e) { this.setState({ regTo: e.target.value }, () => { this.updateVehicleURL(); }) }
	changeChFrom(e) { this.setState({ chFrom: e.target.value }, () => { this.updateVehicleURL(); }) }
	changeChTo(e) { this.setState({ chTo: e.target.value }, () => { this.updateVehicleURL(); }) }
	changeDoorsFrom(e) { this.setState({ doorsFrom: e.target.value }, () => { this.updateVehicleURL(); }) }
	changeDoorsTo(e) { this.setState({ doorsTo: e.target.value }, () => { this.updateVehicleURL(); }) }
	changeTransAuto() { this.setState({ checkedTransAuto: !this.state.checkedTransAuto }, () => { this.updateVehicleURL(); }) }
	changeTransMan() { this.setState({ checkedTransMan: !this.state.checkedTransMan }, () => { this.updateVehicleURL(); }) }
	changeTransSemi() { this.setState({ checkedTransSemi: !this.state.checkedTransSemi }, () => { this.updateVehicleURL(); }) }
	changeFuelPetrol() { this.setState({ checkedFuelPetrol: !this.state.checkedFuelPetrol }, () => { this.updateVehicleURL(); }) }
	changeFuelDiesel() { this.setState({ checkedFuelDiesel: !this.state.checkedFuelDiesel }, () => { this.updateVehicleURL(); }) }
	changeFuelElec() { this.setState({ checkedFuelElec: !this.state.checkedFuelElec }, () => { this.updateVehicleURL(); }) }
	changeFuelElecPetrol() { this.setState({ checkedFuelElecPetrol: !this.state.checkedFuelElecPetrol }, () => { this.updateVehicleURL(); }) }
	changeFuelElecDiesel() { this.setState({ checkedFuelElecDiesel: !this.state.checkedFuelElecDiesel }, () => { this.updateVehicleURL(); }) }
	changeBodyConvertible() { this.setState({ checkedBodyConvertible: !this.state.checkedBodyConvertible }, () => { this.updateVehicleURL(); }) }
	changeBodyCoupe() { this.setState({ checkedBodyCoupe: !this.state.checkedBodyCoupe }, () => { this.updateVehicleURL(); }) }
	changeBodySUV() { this.setState({ checkedBodySUV: !this.state.checkedBodySUV }, () => { this.updateVehicleURL(); }) }
	changeBodySedan() { this.setState({ checkedBodySedan: !this.state.checkedBodySedan }, () => { this.updateVehicleURL(); }) }
	changeBodySW() { this.setState({ checkedBodySW: !this.state.checkedBodySW }, () => { this.updateVehicleURL(); }) }

	updateVehicleURL() {
		this.setState({ vehicleURL: buildURL(this.state) });
	}

	render() {
		return (
			<AddVehicleForm 
				submitForm={this.handleSubmitForm}
				title={this.state.title} changeTitle = {this.changeTitle}
				brand={this.state.brand} changeBrand = {this.changeBrand}
				model={this.state.model} changeModel = {this.changeModel}
				version={this.state.version} changeVersion = {this.changeVersion}
				regFrom={this.state.regFrom} changeRegFrom = {this.changeRegFrom}
				regTo={this.state.regTo} changeRegTo = {this.changeRegTo}
				chFrom={this.state.chFrom} changeChFrom = {this.changeChFrom}
				chTo={this.state.chTo} changeChTo = {this.changeChTo}
				doorsFrom={this.state.doorsFrom} changeDoorsFrom = {this.changeDoorsFrom}
				doorsTo={this.state.doorsTo} changeDoorsTo = {this.changeDoorsTo}
				checkedTransAuto={this.state.checkedTransAuto} changeTransAuto={this.changeTransAuto}
				checkedTransMan={this.state.checkedTransMan} changeTransMan={this.changeTransMan}
				checkedTransSemi={this.state.checkedTransSemi} changeTransSemi={this.changeTransSemi}
				checkedFuelPetrol={this.state.checkedFuelPetrol} changeFuelPetrol={this.changeFuelPetrol}
				checkedFuelDiesel={this.state.checkedFuelDiesel} changeFuelDiesel={this.changeFuelDiesel}
				checkedFuelElec={this.state.checkedFuelElec} changeFuelElec={this.changeFuelElec}
				checkedFuelElecPetrol={this.state.checkedFuelElecPetrol} changeFuelElecPetrol={this.changeFuelElecPetrol}
				checkedFuelElecDiesel={this.state.checkedFuelElecDiesel} changeFuelElecDiesel={this.changeFuelElecDiesel}
				checkedBodyConvertible={this.state.checkedBodyConvertible} changeBodyConvertible={this.changeBodyConvertible}
				checkedBodyCoupe={this.state.checkedBodyCoupe} changeBodyCoupe={this.changeBodyCoupe}
				checkedBodySUV={this.state.checkedBodySUV} changeBodySUV={this.changeBodySUV}
				checkedBodySedan={this.state.checkedBodySedan} changeBodySedan={this.changeBodySedan}
				checkedBodySW={this.state.checkedBodySW} changeBodySW={this.changeBodySW}
				vehicleURL={this.state.vehicleURL}
			/>
		)
	}
}