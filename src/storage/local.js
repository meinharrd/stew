import config from '../config/config';

export default function createLocalStorageClient() {
	return {
		getSourceSecretKey: () => {
			try {
				return JSON.parse(localStorage.getItem(config.localStorage.secretKeyName));
			} catch (error) {
				return {};
			}
		},
		setSourceSecretKey: (sourceSecretKey, isTestNetKey) => {
			try {
				localStorage.setItem(
					config.localStorage.secretKeyName,
					JSON.stringify({sourceSecretKey, isTestNetKey})
				);
			} catch (error) {}
		},
		removeSourceSecretKey: () => {
			try {
				localStorage.removeItem(config.localStorage.secretKeyName);
			} catch(error) {}
		},
	}
}
