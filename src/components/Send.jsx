import React, { Component } from 'react';

import Balance from './Balance';

export default class Send extends Component {
	constructor(props) {
		super(props);
		this.state = {
			scannedPublicAddress : '',
			amountInLumens : ''
		};
	}

	handleAddressChange = (event) => {
		this.setState({ scannedPublicAddress: event.target.value })
	}

	handleAmountChange = (event) => {
		this.setState({ amountInLumens: event.target.value })
	}

	confirmTopup = () => {
		if (this.state.amountInLumens && this.state.scannedPublicAddress) {
			this.props.confirmSend(this.state.scannedPublicAddress, this.state.amountInLumens);
		}
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
			<div className="pure-form">
				<span>Address </span>
				<input
					type="text"
					size="56"
					maxLength="56"
					onChange={this.handleAddressChange}
					value={this.state.scannedPublicAddress}
				/>
				<div className="vert-dist"/>
				<span>Amount </span>
				<input
					type="number"
					step="0.1"
					placeholder="XLM"
					onChange={this.handleAmountChange}
					value={this.state.amountInLumens}
				/>
			</div>
			<div className="vert-dist"/>
			<button className="pure-button" onClick={this.props.home}>
				Cancel
			</button>
			&nbsp;
			<button className="pure-button pure-button-primary" onClick={this.confirmTopup}>
				Send
			</button>
		</div>
	);
}
