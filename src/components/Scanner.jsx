import React from 'react';
import QrReader from 'react-qr-reader'

export default (props) => {
	let message = '';
	switch(props.mode) {
		case 'checkDestinationAddress':
			message = 'Checking scanned address...';
			break;
		case 'destinationAddressError':
			message = 'Scanned address invalid. Try again';
			break;
		case 'topupDeclined':
			message = '';
			break;
	}

	return (
		<div className="scanner">
			<QrReader
				delay={300}
				onError={props.handleError}
				onScan={props.handleScan}
				style={{ width: '100%' }}
			/>
			<div className="vert-dist"/>
			<button className="pure-button" onClick={props.abort}>Cancel</button>
			<div className="vert-dist"/>
			{message}
		</div>
	);
};
