import React, { Component } from 'react';
import { Icon } from '@blueprintjs/core';

export default class StatisticsBox extends Component {
	render() {
		return (
			<div className='statisticsBox'>
				<div className='statisticsBoxIcon'>
					<Icon icon={this.props.icon} iconSize={40} />
				</div>
				<div className='statisticsBoxData'>
					<p className='statisticsNumber'>{this.props.number}</p>
					<p className='statisticsCaption'>{this.props.caption}</p>
				</div>
			</div>
		);
	}
}