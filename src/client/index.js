import "core-js/es";
import 'raf/polyfill';

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { hydrate } from "react-dom";
import { configureStore } from './store.js';
import App from "./App";
import { loadableReady } from '@loadable/component';

import "./../../assets/css/bootstrap.css";
import "./../../assets/css/app.css";

const store = configureStore(window.__INITIAL_STATE__);

function mount() {
	loadableReady(() => {
		hydrate(
			<Provider store={store}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</Provider>,
			document.getElementById('app')
		);
	});
}

window.onload = function () {
	mount();
};
