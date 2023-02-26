import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VehicleList from './VehicleList';
import vehicleListActions from '../../Actions/vehicleListActions';

const VehicleListContainer = (props) => {
  const [filteredList, setFilteredList] = React.useState(props.vehiclesList);
  const [searchTerm, setSearchTerm] = React.useState('');
  // const [loading, setLoading] = React.useState(true);

  // Filter vehicleList when search term is changed
  React.useEffect(() => {
    const vehiclesList_filtered = props.vehiclesList.filter((el) => el.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredList(vehiclesList_filtered);
  }, [props.vehiclesList, searchTerm]);

  const handleChangeSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const editVehicle = (vehicle) => {
    props.editVehicle(vehicle);
    window.scroll({ top: 0, behavior: 'smooth' });
  };

  const deleteVehicle = async (title) => {
    await props.deleteVehicle(title);
  };

  return (
    <VehicleList
      vehicleList={filteredList}
      editVehicle={editVehicle}
      deleteVehicle={deleteVehicle}
      searchTerm={searchTerm}
      handleChangeSearchTerm={handleChangeSearchTerm}
    />
  );
};

VehicleListContainer.propTypes = {
  vehiclesList: PropTypes.arrayOf(PropTypes.object).isRequired,
  editVehicle: PropTypes.func.isRequired,
  deleteVehicle: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  vehiclesList: store.vehiclesState.vehiclesList,
});

const mapDispatchToProps = (dispatch) => ({
  editVehicle: (vehicle) => dispatch(vehicleListActions.editVehicle(vehicle)),
  deleteVehicle: (title) => dispatch(vehicleListActions.deleteVehicle(title)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VehicleListContainer);
