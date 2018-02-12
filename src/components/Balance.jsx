import { Component } from 'react';

export default class Balance extends Component {
	constructor(props) {
		super(props);
		this.state = { intervalStarted: false, balance: null };
		props.sourceAccountPromise.then(sourceAccount => {
			this.updateStateFromSourceAccount(sourceAccount);
		});
	}

	stopIntervalIfNeeded = () => {
		if (this.state.intervalStarted) {
			clearInterval(this.state.intervalId);
			this.setState({ intervalStarted: false });
		}
	}

	updateStateFromSourceAccount(sourceAccount) {
		this.setState({ balance: sourceAccount.getBalance() });
	}

	updateBalance = async () => {
		try {
			const sourceAccount = await this.props.sourceAccountPromise;
			await sourceAccount.reloadAccount();
			this.updateStateFromSourceAccount(sourceAccount);
		} catch (error) {
			this.props.accountNotValid();
		}
	}

	startInterval = () => {
		this.setState({
			intervalStarted: true,
			intervalId: setInterval(() => {
				this.updateBalance()
			}, 3000)
		});
	}

	componentDidMount = () => {
		this.stopIntervalIfNeeded();
		this.startInterval();
	}

	componentWillUnmount = () => {
		this.stopIntervalIfNeeded();
	}

	render = () =>
		' ' + this.state.balance !== null ? this.state.balance + ' XLM' : '(loading)'
}
