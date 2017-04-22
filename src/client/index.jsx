import React from 'react';
import ReactDOM from 'react-dom';
import { matchRoutes } from 'react-router-config';
import { BrowserRouter as Router } from 'react-router-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { loadComponents, clearCache } from '../shared/lib/router';
import reducers from '../shared/state/reducers';
import createRoutes from '../shared/routes';
import App from '../shared/containers/App';
import RouterContext from '../shared/components/AsyncRouterContext';

// Configure redux store
const state = window.__STATE__ || {}; // eslint-disable-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line
const store = createStore(
  reducers,
  state,
  composeEnhancers(applyMiddleware(thunk)),
);

const container = document.querySelector('#app'); // eslint-disable-line

// Rendering container
function render(routeCreator) {
  const path = window.location.pathname;
  const routes = routeCreator(store);
  const branch = matchRoutes(routes, path);

  loadComponents(branch).then(() => {
    ReactDOM.render(
      <AppContainer>
        <Router>
          <RouterContext store={store} routes={routes}>
            <Provider store={store}>
              <App routes={routes} />
            </Provider>
          </RouterContext>
        </Router>
      </AppContainer>,
      container,
    );
  });
}

// Render apps
render(createRoutes);

// Hot Loader
if (module.hot) {
  module.hot.accept('../shared/routes', () => {
    import('../shared/routes').then((module) => {
      clearCache();
      render(module.default);
    });
  });
}
