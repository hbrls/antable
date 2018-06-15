import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


const router = Router(); // eslint-disable-line no-undef, no-unused-vars

const store = {
  getState: () => {
    console.log('index.store.getState');
  },
  subscribe: () => {
    console.log('index.store.subscribe');
  },
  dispatch: () => {
    console.log('index.store.dispatch');
  },
};


const routerAdapter = {
  push: () => {
    console.log('index.routerAdapter.push');
  },
  getRoute: () => {
    console.log('index.routerAdapter.getRoute');
  },
  replace: () => {
    console.log('index.routerAdapter.replace');
  },
  query: () => {
    console.log('index.routerAdapter.query');
  },
  go: () => {
    console.log('index.routerAdapter.go');
  },
  goBack: () => {
    console.log('index.routerAdapter.goBack');
  },
  goForward: () => {
    console.log('index.routerAdapter.goForward');
  },
  setRouteLeaveHook: () => {
    console.log('index.routerAdapter.setRouteLeaveHook');
  },
  isActive: () => {
    console.log('index.routerAdapter.isActive');
  },
};


ReactDOM.render(<App store={store} router={routerAdapter} />, document.querySelector('.App'));
