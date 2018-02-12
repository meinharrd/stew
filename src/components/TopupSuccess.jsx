import React from 'react';

export default (props) => (
	<div>
		Sent!
		<div className="vert-dist"/>
		<button className="pure-button" onClick={props.restart}>
			Home
		</button>
	</div>
);
