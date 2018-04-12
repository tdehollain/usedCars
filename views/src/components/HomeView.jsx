import React, { Component } from 'react';
import ChartsViewContainer from './ChartsViewContainer';

export default class HomeView extends Component {
	render() {
		return (
			<div className='homeView'>
				<ChartsViewContainer />
			</div>
		)
	}
}