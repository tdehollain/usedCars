import React, { Component } from 'react';
import { connect } from 'react-redux';
import VehicleList from './VehicleList';
import vehicleListActions from './vehicleListActions';

class VehicleListContainer extends Component {

	constructor() {
		super();
		this.state = {
			filteredList: [],
			searchTerm: '',
			loading: true
		};
		this.handleChangeSearchTerm = this.handleChangeSearchTerm.bind(this);
		this.editVehicle = this.editVehicle.bind(this);
		this.deleteVehicle = this.deleteVehicle.bind(this);
	}

	async componentDidMount() {
		let list = await this.props.getVehicleList();
		this.setState({ filteredList: list, loading: false });
	}

	componentDidUpdate(prevProps) {
		if (prevProps.vehicleList.length !== this.props.vehicleList.length) {
			this.setState({
				filteredList: this.props.vehicleList.filter(el => el.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
			})
		}
	}

	handleChangeSearchTerm(e) {
		this.setState({
			searchTerm: e.target.value,
			filteredList: this.props.vehicleList.filter(el => el.title.toLowerCase().includes(e.target.value.toLowerCase()))
		});
	}

	editVehicle(vehicle) {
		this.props.editVehicle(vehicle);
		window.scroll({ top: 0, behavior: 'smooth' });
	}

	async deleteVehicle(title) {
		await this.props.deleteVehicle(title);
	}

	render() {

		return (
			<VehicleList
				vehicleList={this.state.filteredList}
				editVehicle={this.editVehicle}
				deleteVehicle={this.deleteVehicle}
				searchTerm={this.state.searchTerm}
				handleChangeSearchTerm={this.handleChangeSearchTerm}
			/>
		)
	}
}

const mapStateToProps = (store) => {
	return { vehicleList: store.adminViewState.vehicleList };
}

const mapDispatchToProps = (dispatch) => {
	return {
		getVehicleList: () => dispatch(vehicleListActions.getVehicleList()),
		editVehicle: vehicle => dispatch(vehicleListActions.editVehicle(vehicle)),
		deleteVehicle: title => dispatch(vehicleListActions.deleteVehicle(title))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(VehicleListContainer);