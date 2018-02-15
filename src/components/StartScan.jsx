import React from 'react';

import Balance from './Balance';

export default (props) => (
	<div>
		<span>
			<Balance
				sourceAccountPromise={props.sourceAccountPromise}
				accountNotValid={props.accountNotValid}
			/>
		</span>
		<div className="vert-dist"/>
		<button className="pure-button pure-button-primary" onClick={props.startSend}>
			Send
		</button>
		&nbsp;
		<button className="pure-button pure-button-primary" onClick={props.startReceive}>
			Receive
		</button>
		&nbsp;
		<button className="pure-button pure-button-primary" onClick={props.startScan}>
			Scan
		</button>
		<div className="vert-dist"/>
		<button className="pure-button" onClick={props.logout}>
			Log out
		</button>
	</div>
);
