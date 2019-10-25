import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';

const Root = () => (
	    <BrowserRouter>
	            <div>
	                <Switch>
	                    <Route path="/" component={App}/>
	                </Switch>
	            </div>
	    </BrowserRouter>
	);

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
