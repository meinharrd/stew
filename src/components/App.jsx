import React, { Component } from 'react';

import createSourceAccountClient from '../stellar/stellar';
import Login from './Login';
import CheckSourceAccount from './CheckSourceAccount';
import ConfirmTopup from './ConfirmTopup';
import Receive from './Receive';
import Scanner from './Scanner';
import SourceAccountError from './SourceAccountError';
import StartScan from './StartScan';
import TopupFailure from './TopupFailure';
import TopupPending from './TopupPending';
import TopupSuccess from './TopupSuccess';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = this.initStateFromLocalStorage(props);
	}

	initStateFromLocalStorage = (props) => {
		const {sourceSecretKey, isTestNetKey} = props.localStorageClient.getSourceSecretKey() || {};

		if (sourceSecretKey) {
			return {
				mode: 'checkSourceAccount',
				sourceAccountPromise: this.createSourceAccountPromise(sourceSecretKey, isTestNetKey)
			};
		} else {
			return { mode: 'login' };
		}
	}

	createSourceAccountPromise(sourceSecretKey, isTestNetKey) {
		const sourceAccountPromise = createSourceAccountClient(sourceSecretKey, isTestNetKey);
		sourceAccountPromise.then(
			sourceAccount => this.setState({ mode : 'startScan' })
		).catch(error => {
			if (error.message === 'Account not found') {
				this.setState({ mode: 'sourceAccountNotFound' });
			} else {
				this.setState({ mode: 'sourceAccountError' });
			}
		});

		return sourceAccountPromise;
	}

	login = (sourceSecretKey, isTestNetKey) => {
		this.props.localStorageClient.setSourceSecretKey(sourceSecretKey, isTestNetKey);

		this.setState({
			mode: 'checkSourceAccount',
			sourceAccountPromise: this.createSourceAccountPromise(sourceSecretKey, isTestNetKey)
		})
	}

	logout = () => {
		this.props.localStorageClient.removeSourceSecretKey();

		this.setState({ mode: 'login' });
	}

	handleScan = async data => {
		if (data && this.state.mode !== 'checkDestinationAddress') {

		  var address;
			try {
			  // Stargazer QR code format
				var json = JSON.parse(data);
				if (json.stellar && json.stellar.account && json.stellar.account.id) {
					address = json.stellar.account.id;
				}
			} catch(e) {
				address = data;
			}

			this.setState({
				scannedPublicAddress: address,
				mode: 'checkDestinationAddress',
			});

			const sourceAccount = await this.state.sourceAccountPromise;
			try {
				if (this.state.scannedPublicAddress) {
					const destinactionAccountActivated = await sourceAccount.isDestinationAccountActivated(this.state.scannedPublicAddress)
					this.setState({ destinactionAccountActivated, mode: 'confirmTopup' });
				}
			} catch (error) {
				this.setState({ mode: 'destinationAddressError' });
				console.log(error);
				console.log(error.message)
			}
		}
	}

	handleError = err => {
		console.error(err);
	}

	declineTopup = () => {
		this.setState({ mode: 'topupDeclined' });
	}

	sourceAccountNotValid = () => {
		this.setState({ mode: 'sourceAccountError' });
	}

	confirmTopup = async (amountInLumens) => {
		this.setState({ mode: 'topupPending' });
		const sourceAccount = await this.state.sourceAccountPromise;
		try {
			await sourceAccount.createSignAndSubmitTransaction(this.state.scannedPublicAddress, amountInLumens);
			this.setState({ mode: 'topupSuccess' });
		} catch(error) {
			this.setState({ mode: 'topupFailure' });
			console.log(error)
			console.log(error.message)
		}
	}

	restart = () => {
		this.setState(this.initStateFromLocalStorage(this.props));
	}

	home = () => {
		this.setState({ mode: 'home' });
	}

	abortScan = () => {
		this.setState({ mode: 'startScan' });
	}

	startScan = () => {
		this.setState({ mode: 'scan' });
	}

	startReceive = () => {
		this.setState({ mode: 'receive' });
	}

	renderConfirmation = () => {
		let subComponent;
		switch (this.state.mode) {
			case 'confirmTopup':
				subComponent = <ConfirmTopup
					sourceAccountPromise={this.state.sourceAccountPromise}
					accountNotValid={this.sourceAccountNotValid}
					declineTopup={this.declineTopup}
					confirmTopup={this.confirmTopup}
					activated={this.state.destinactionAccountActivated}
				/>;
				break;
			case 'topupFailure':
				subComponent = <TopupFailure
					restart={this.restart}
				/>;
				break;
			case 'topupSuccess':
				subComponent = <TopupSuccess
					restart={this.restart}
				/>;
				break;
			case 'topupPending':
				subComponent = <TopupPending />;
				break;
		}

		const message = this.state.destinactionAccountActivated ?
			'' :
			' (not activated)';

		return (
			<div className="scanner-message">
				Recipient:
				<div>
					<em className="public-address">{this.state.scannedPublicAddress}</em>
					{message}
				</div>
				<div className="vert-dist"/>
				{subComponent}
			</div>
		);
	}

	render = () => {
		switch(this.state.mode) {
			case 'login':
				return <Login login={this.login}/>;
			case 'checkSourceAccount':
				return <CheckSourceAccount abort={this.logout}/>;
			case 'receive':
				return <Receive
					sourceAccountPromise={this.state.sourceAccountPromise}
					accountNotValid={this.sourceAccountNotValid}
					home={this.home}
					mode={this.state.mode}
				/>
			case 'sourceAccountError':
			case 'sourceAccountNotFound':
				return <SourceAccountError
					abort={this.logout}
					notFound={this.state.mode === 'sourceAccountNotFound'}/>;
			case 'home':
			case 'startScan':
				return <StartScan
					sourceAccountPromise={this.state.sourceAccountPromise}
					accountNotValid={this.sourceAccountNotValid}
					logout={this.logout}
					startReceive={this.startReceive}
					startScan={this.startScan}
				/>;
			case 'scan':
			case 'topupDeclined':
			case 'checkDestinationAddress':
			case 'destinationAddressError':
				return <Scanner
					handleError={this.handleError}
					handleScan={this.handleScan}
					abort={this.abortScan}
					mode={this.state.mode}
				/>
			case 'confirmTopup':
			case 'topupFailure':
			case 'topupSuccess':
			case 'topupPending':
				return this.renderConfirmation();
		}
	};
};
