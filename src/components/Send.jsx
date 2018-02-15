import React, { Component } from 'react';

import Balance from './Balance';

export default class Send extends Component {
	render = () => (
		<div>
			<span>
				<Balance
					sourceAccountPromise={this.props.sourceAccountPromise}
					accountNotValid={this.props.accountNotValid}
				/>
			</span>
			<div className="vert-dist"/>
			<button className="pure-button pure-button-primary" onClick={this.props.home}>
				Home
			</button>
		</div>
	);
}
