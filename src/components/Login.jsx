import React, { Component } from 'react'

export default class Login extends Component {
	constructor(props){
		super(props);
		this.state = {
			secretKey: '',
			testNet: false
		};
	}

	handleSecretKeyChange = (event) => {
		this.setState({ secretKey: event.target.value })
	}

	handleNetChange = (event) => {
		this.setState({ testNet: event.target.checked })
	}

	submitEnterSecretKey = (event) => {
		event.preventDefault();
		this.props.login(this.state.secretKey, this.state.testNet);
	}

	render = () => (
		<form className="pure-form pure-form-stacked secret-key" onSubmit={this.submitEnterSecretKey}>
			<fieldset>
				<input
					type="password"
					placeholder="Secret Key"
					className="key"
					onChange={this.handleSecretKeyChange}
					value={this.state.secretKey}
				/>

				<label htmlFor="testnet" className="pure-checkbox">
					<input
						id="testnet"
						type="checkbox"
						checked={this.state.testNet}
						onChange={this.handleNetChange}
					/>
					&nbsp;Testnet
				</label>

				<button type="submit" className="pure-button pure-button-primary">Log in</button>
			</fieldset>
		</form>
	);
}
