import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import adminViewReducer from './reducers/adminViewReducer';

/*===========================
=====   User settings   =====
===========================*/
const userState = {

};

const userReducer = (state = userState, action) => {
	switch (action.type) {
		default: return state;
	}
};

/*==========================
=====   Vehicle data   =====
==========================*/
const vehiclesDataState = {
	vehiclesData: []
};

const vehiclesDataReducer = (state = vehiclesDataState, action) => {
	switch (action.type) {
		case "UPDATE_VEHICLES_DATA":
			return { vehiclesData: action.vehiclesData };
		default: return state
	}
};

/*================================
=====   Vehicle statistics   =====
================================*/
const vehiclesStatisticsState = {
	nbVehicles: null,
	medianPrice: null,
	priceP10: null,
	priceP90: null,
	slope1: null,
	slope2: null,
};

const vehiclesStatisticsReducer = (state = vehiclesStatisticsState, action) => {
	switch (action.type) {
		case "UPDATE_REGRESSION_SLOPES":
			return { ...state, ...action.data };
		case "UPDATE_VEHICLE_STATISTICS":
			return { ...state, ...action.data }
		default: return state
	}
};


/*======================
=====   Reducers   =====
======================*/
const reducers = combineReducers({
	userState: userReducer,
	adminViewState: adminViewReducer,
	vehiclesDataState: vehiclesDataReducer,
	vehiclesStatisticsState: vehiclesStatisticsReducer
});

// export const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunkMiddleware)));