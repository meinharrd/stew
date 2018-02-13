import React, { Component } from 'react';

import Balance from './Balance';

export default class Receive extends Component {
	constructor(props) {
		super(props);
		this.state = { publicKey: '' };
		props.sourceAccountPromise.then(sourceAccount => {
			this.setState({ publicKey: sourceAccount.getPublicKey() });
		});
	}

	render = () => (
		<div>
			<span>
				<Balance
					sourceAccountPromise={this.props.sourceAccountPromise}
					accountNotValid={this.props.accountNotValid}
				/>
			</span>
			<div className="vert-dist"/>
			<img src={'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chld=|0&chl=' + this.state.publicKey} alt="QR code" />
			<em className="public-address">{this.state.publicKey}</em>
			<div className="vert-dist"/>
			<button className="pure-button pure-button-primary" onClick={this.props.home}>
				Home
			</button>
		</div>
	);
}
