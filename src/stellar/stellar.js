import { Asset, Network, Keypair, Server, Operation, TransactionBuilder } from 'stellar-sdk';
import config from '../config/config';

const serverLivenet = new Server(config.horizon.livenet);
const serverTestnet = new Server(config.horizon.testnet);

export default async function createSourceAccountClient(sourceSecretKey, isTestNetAddress) {
	const stellarServer = isTestNetAddress ? serverTestnet : serverLivenet;

	let sourceAccount;
	const reloadAccount = async () => {
		selectNetwork(isTestNetAddress);
		const sourceKeypair = Keypair.fromSecret(sourceSecretKey);
		const sourcePublicKey = sourceKeypair.publicKey();

		try {
			sourceAccount = await stellarServer.loadAccount(sourcePublicKey);
		} catch(error) {
			throw new Error('Account not found');
		}
		if (!sourceAccount) {
			throw new Error('Account not found');
		}
	}
	await reloadAccount();

	const isDestinationAccountActivated = async (destinationPublicKey) => {
		try {
			selectNetwork(isTestNetAddress);
			await stellarServer.loadAccount(destinationPublicKey);
			return true;
		} catch (error) {
			if (error.name === 'NotFoundError') {
				return false;
			}
			throw error;
		}
	};

	const createSignAndSubmitTransaction = async (destinationPublicKey, amountInLumens) => {
		selectNetwork(isTestNetAddress);
		const transaction = await createAccountCreationTransaction(sourceAccount, destinationPublicKey, amountInLumens, stellarServer);
		console.log(transaction);
		console.log(await signAndSubmit(sourceSecretKey, transaction, stellarServer));
	};

	const getBalance = () => {
		if (sourceAccount.balances) {
			const balanceItem = sourceAccount.balances.find(balanceItem => balanceItem.asset_type === 'native');
			if (balanceItem) {
				return balanceItem.balance;
			}
		}
		return '';
	};

	return {
		isDestinationAccountActivated,
		createSignAndSubmitTransaction,
		getBalance,
		reloadAccount
	}
}

async function createAccountCreationTransaction(sourceAccount, destinationPublicKey, amountInLumens, stellarServer) {
	try {
		await stellarServer.loadAccount(destinationPublicKey);
		return new TransactionBuilder(sourceAccount)
			.addOperation(
				Operation.payment({
					amount: lumensToString(amountInLumens),
					asset: Asset.native(),
					destination: destinationPublicKey,
				})
			)
			.build()
	} catch(error) {
		if (error.name === 'NotFoundError') {
			return new TransactionBuilder(sourceAccount)
				.addOperation(
					Operation.createAccount({
						destination: destinationPublicKey,
						startingBalance: lumensToString(amountInLumens)
					})
				)
				.build()
		}
	}
}

async function signAndSubmit(sourceSecretKey, transaction, stellarServer) {
	const keypair = Keypair.fromSecret(sourceSecretKey);
	transaction.sign(keypair);

	return await stellarServer.submitTransaction(transaction);
}

function selectNetwork(isTestNetAddress) {
	if (isTestNetAddress) {
		Network.useTestNetwork();
	} else {
		Network.usePublicNetwork();
	}
}

function lumensToString (lumens) {
	let string = (Math.round(lumens * 1e7)).toString();

	if (string.length < 8) {
		string = '0'.repeat(8 - string.length) + string;
	}

	return `${string.substring(0, string.length - 7)}.${string.substring(string.length - 7)}`
}
