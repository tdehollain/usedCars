import React from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import vehicleActions from '../Actions/vehicleActions';
import HomeView from '../HomeView/HomeView';
import AdminView from '../AdminView/AdminView';

const MainContainer = () => {
  const dispatch = useDispatch();
  const stableDispatch = React.useCallback(dispatch, []);

  // When mounting: loading list of vehicles
  React.useEffect(() => {
    stableDispatch(vehicleActions.updateVehiclesList());
  }, [stableDispatch]);

  return (
    <div className="mainContainer">
      <Switch>
        <Route exact path="/" component={HomeView} />
        <Route path="/admin" component={AdminView} />
      </Switch>
    </div>
  );
};

export default MainContainer;
