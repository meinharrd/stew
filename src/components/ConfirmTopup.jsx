import React, { Component } from 'react';

import Balance from './Balance';

export default class ConfirmTopup extends Component {
	constructor(props) {
		super(props);
		this.state = { amountInLumens : '' };
	}

	handleAmountChange = (event) => {
		this.setState({ amountInLumens: event.target.value })
	}

	confirmTopup = () => {
		if (this.state.amountInLumens) {
			this.props.confirmTopup(this.state.amountInLumens);
		}
	}

	render = () => (
		<div>
			<div>
				<Balance
					sourceAccountPromise={this.props.sourceAccountPromise}
					accountNotValid={this.props.accountNotValid}
				/>
			</div>
			<div className="vert-dist"/>
			<div className="pure-form" onSubmit={this.submitEnterSecretKey}>
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
			<button className="pure-button" onClick={this.props.declineTopup}>
				Cancel
			</button>
			<span className="hor-dist"/>
			<button className="pure-button pure-button-primary" onClick={this.confirmTopup}>
				Send
			</button>
		</div>
	)
}
