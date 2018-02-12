import React from 'react';

export default (props) => (
	<div className="scanner-message">
		{props.notFound ? 'Account not activated' : 'Secret key is not valid'}
		<div className="vert-dist"/>
		<button className="pure-button" onClick={props.abort}>Cancel</button>
	</div>
);
