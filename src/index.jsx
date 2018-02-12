import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './pure-min.css';

import App from './components/App';
import createLocalStorageClient from './storage/local';

const localStorageClient = createLocalStorageClient();

ReactDOM.render(
	<div className="content">
	  <div className="logo">
		  <span role="img" aria-label="Couple dancing with a space rocket">💃🚀🕺</span>
		</div>
		<App
			localStorageClient={localStorageClient}
		/>
	</div>,
	document.getElementById('root')
);
