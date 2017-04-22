import qs from 'querystring';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { matchRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import Helmet from 'react-helmet';
import { loadComponents, applyHook } from '../shared/lib/router';
import fetchData from '../shared/lib/fetchData';
import reducers from '../shared/state/reducers';
import createRoutes from '../shared/routes';
import App from '../shared/containers/App';

function getLocation(req) {
  const search = qs.stringify(req.query);
  return {
    pathname: req.path,
    search: search ? `?${search}` : '',
  };
}

export default (preload, cb) => async (req, res, next) => {
  const location = getLocation(req);
  const store = createStore(reducers, applyMiddleware(thunk));
  const routes = createRoutes(store);
  const context = {};

  try {
    // Preload data.
    await preload(req, res, store);

    // Analyst match route.
    const matches = matchRoutes(routes, req.path);

    // Not found.
    if (matches.length === 0) {
      return next();
    }

    // Apply router hook.
    const { url } = await applyHook(matches, location);
    if (url) {
      return res.redirect(url);
    }

    // Load component and fetch data.
    const components = await loadComponents(matches);
    await fetchData({
      store,
      components,
      location,
    });

    const state = JSON.stringify(store.getState());

    const app = (
      <Router location={req.url} context={context}>
        <Provider store={store}>
          <App routes={routes} />
        </Provider>
      </Router>
    );
    const content = renderToString(app);

    // Not found.
    if (context.status === 404) {
      return next();
    }

    // Redirect url.
    if (context.url) {
      return res.redirect(context.url);
    }

    // Helmet rewind after render component.
    const { title, meta } = Helmet.rewind();

    return cb(res, {
      title,
      meta,
      state,
      content,
    });
  } catch (e) {
    return next(e);
  }
};
