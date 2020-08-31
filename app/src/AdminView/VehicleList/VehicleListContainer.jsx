import React from 'react';
import { connect } from 'react-redux';
import VehicleList from './VehicleList';
import vehicleListActions from './vehicleListActions';

const VehicleListContainer = props => {
  // const [vehicleList, setVehicleList] = React.useState([]);
  const [filteredList, setFilteredList] = React.useState(props.vehiclesList);
  const [searchTerm, setSearchTerm] = React.useState('');
  // const [loading, setLoading] = React.useState(true);

  // Load complete vehicle list when mounting
  // React.useEffect(() => {
  //   const getList = async () => {
  //     const list = await props.getVehicleList();
  //     setVehicleList(list);
  //     setFilteredList(list);
  //   };
  //   getList();
  // }, []);

  // Filter vehicleList when search term is changed
  React.useEffect(() => {
    const filteredList = props.vehiclesList.filter(el => el.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredList(filteredList);
  }, [searchTerm]);

  const handleChangeSearchTerm = e => {
    setSearchTerm(e.target.value);
  };

  const editVehicle = vehicle => {
    props.editVehicle(vehicle);
    window.scroll({ top: 0, behavior: 'smooth' });
  };

  const deleteVehicle = async title => {
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

const mapStateToProps = store => ({
  vehiclesList: store.vehiclesState.vehiclesList,
});

const mapDispatchToProps = dispatch => {
  return {
    editVehicle: vehicle => dispatch(vehicleListActions.editVehicle(vehicle)),
    deleteVehicle: title => dispatch(vehicleListActions.deleteVehicle(title))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VehicleListContainer);
