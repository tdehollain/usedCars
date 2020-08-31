import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import userReducer from './reducers/userReducer';
import vehicleReducer from './reducers/vehicleReducer';
// import adminViewReducer from './reducers/adminViewReducer';

/*= =====================
=====   Reducers   =====
====================== */
const reducers = combineReducers({
  userState: userReducer,
  vehiclesState: vehicleReducer,
  // adminViewState: adminViewReducer,
});

// export const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunkMiddleware)));
