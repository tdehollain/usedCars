import { createStore, combineReducers } from 'redux';

/*===========================
=====   User settings   =====
===========================*/
const userState = {

};

const userReducer = (state=userState, action) => {
	switch(action.type) {
		default: return state;
	}
};

/*==========================
=====   Vehicle list   =====
==========================*/
const vehicleListState = {
	vehicleList: []
};

const vehicleListReducer = (state=vehicleListState, action) => {
	switch(action.type) {
		case "ADD_VEHICLE":
			return {...state, vehicleList: [...state.vehicleList, action.vehicle] };
		case "DELETE_VEHICLE":
			return {...state, vehicleList: state.vehicleList.filter(el => el._id !== action.id) };
		case "UPDATE_VEHICLE_LIST":
			return {...state, vehicleList: action.vehicleList};
		default: return state
	}
};

/*==========================
=====   Vehicle data   =====
==========================*/
const vehiclesDataState = {
	vehiclesData: []
};

const vehiclesDataReducer = (state=vehiclesDataState, action) => {
	switch(action.type) {
		case "UPDATE_VEHICLES_DATA":
			return { vehiclesData: action.vehiclesData };
		default: return state
	}
};


/*======================
=====   Reducers   =====
======================*/
const reducers = combineReducers({
	userState: userReducer,
	vehicleListState: vehicleListReducer,
	vehiclesDataState: vehiclesDataReducer
});

export const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());