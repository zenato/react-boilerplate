import React from 'react';
import { renderToString } from 'react-dom/server';
import match from 'react-router/lib/match';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import Helmet from 'react-helmet';
import RouterContextProvider from '../shared/components/router';
import fetchData from '../shared/lib/fetchData';
import reducers from '../shared/state/reducers';
import routes from '../shared/routes';

const render = (res, store, renderProps, cb) => {
  const state = JSON.stringify(store.getState());
  const content = renderToString(
    <Provider store={store}>
      <RouterContextProvider {...renderProps} />
    </Provider>,
  );

  // Helmet rewind after component rendering.
  const { title, meta } = Helmet.rewind();

  cb(res, {
    title,
    meta,
    state,
    content,
  });
};

export default (preload, cb) => async (req, res, next) => {
  const store = createStore(reducers, applyMiddleware(thunk));

  try {
    await preload(req, res, store);
  } catch (e) {
    next(e);
    return;
  }

  match({
    routes: routes(store),
    location: req.url,
  }, async (error, redirectLocation, renderProps) => {
    if (error) {
      next(error);
      return;
    }
    if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      return;
    }
    if (!renderProps) {
      next();
      return;
    }

    try {
      await fetchData({ store, ...renderProps });
      render(res, store, renderProps, cb);
    } catch (e) {
      next(e);
    }
  });
};
