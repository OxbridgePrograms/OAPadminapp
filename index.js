import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import fire from './fire';
import Authentication from './pages/authentication';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
