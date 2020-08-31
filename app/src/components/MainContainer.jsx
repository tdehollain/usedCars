import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import vehicleActions from '../Actions/vehicleActions';
import HomeView from '../HomeView/HomeView';
// import AdminView from '../AdminView/AdminView';
// import EvolutionView from '../EvolutionView/EvolutionView';

const MainContainer = (props) => {
  // When mounting: loading list of vehicles
  React.useEffect(() => {
    props.updateVehiclesList();
  }, []);

  return (
    <Switch>
      <Route exact path="/" component={HomeView} />
      {/* <Route path="/evolution/" component={EvolutionView} />
      <Route path="/admin/" component={AdminView} /> */}
    </Switch>
  );
};

MainContainer.propTypes = {
  updateVehiclesList: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  updateVehiclesList: () => dispatch(vehicleActions.updateVehiclesList()),
});

export default connect(null, mapDispatchToProps)(MainContainer);
