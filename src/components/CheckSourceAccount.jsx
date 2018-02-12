import React from 'react';

export default (props) => (
	<div className="scanner-message">
		Loading balance...
		<br />
		<button className="pure-button" onClick={props.abort}>Cancel</button>
	</div>
);
