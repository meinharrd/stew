import React from 'react';

export default (props) => (
	<div>
		Something went wrong. Please try again.
		<div className="vert-dist"/>
		<button className="pure-button" onClick={props.restart}>
			Try again
		</button>
	</div>
);
