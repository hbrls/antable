import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import getQuery from '../../src/common/getQuery';


const router = Router(); // eslint-disable-line no-undef, no-unused-vars


const store = {
  getState: () => {
    console.log('index.store.getState');
  },
  subscribe: () => {
    console.log('index.store.subscribe');
  },
  dispatch: (action) => {
    if (action.type === '@@router/CALL_HISTORY_METHOD') {
      const { method, args } = action.payload;
      const { pathname, query: next } = args[0];
      console.log(method, pathname, next);

      const query = getQuery(router.getRoute(0), 'queryKey');
      Object.keys(next).forEach((id) => { query[id] = next[id]; });
      console.log(query);

      const qs = Object.keys(query).filter(k => k && query[k]).map(k => `${k}=${query[k]}`);

      if (qs.length > 0) {
        router.setRoute(`/?${qs.join('&')}`);
      } else {
        router.setRoute('/');
      }

      head.bus.emit('trigger');
    } else {
      console.log('index.store.dispatch', action);
    }
  },
};


const routerAdapter = {
  push: (...args) => {
    console.log('index.routerAdapter.push', args);
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

  location: {
    pathname: '',
    query: {},
  },
};


ReactDOM.render(<App store={store} router={routerAdapter} />, document.querySelector('.App'));
