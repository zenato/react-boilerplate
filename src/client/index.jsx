import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import browserHistory from 'react-router/lib/browserHistory';
import match from 'react-router/lib/match';
import Router from 'react-router/lib/Router';
import { AppContainer } from 'react-hot-loader';
import reducers from '../shared/state/reducers';
import routes from '../shared/routes';
import RouterContextProvider from '../shared/components/router';

// Configure redux store
const state = __STATE__ || {}; // eslint-disable-line
const composeEnhancers = __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line
const store = createStore(
  reducers,
  state,
  composeEnhancers(applyMiddleware(thunk)),
);

// Rendering container
const container = document.querySelector('#app'); // eslint-disable-line
function render(rootRoute) {
  match({
    history: browserHistory,
    routes: rootRoute(store),
  }, (error, redirectLocation, renderProps) => {
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <Router {...renderProps} render={props => <RouterContextProvider {...props} />} />
        </Provider>
      </AppContainer>
      , container);
  });
}

// Render apps
render(routes);

// Hot Loader
if (module.hot) {
  module.hot.accept('../shared/routes', () => {
    System.import('../shared/routes').then(m => render(m.default));
  });
}
