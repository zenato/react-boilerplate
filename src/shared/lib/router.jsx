import React from 'react';
import { Route, Switch } from 'react-router-dom';

function applyHook(routes, location) {
  const promises = routes.map(({ route, match }) => {
    if (route.enter) {
      return Promise.resolve(route.enter({ location, match }));
    }
    return Promise.resolve();
  });

  return Promise.all(promises).then((res) => {
    const urls = res.filter(r => r && r.startsWith('url:'));
    return {
      url: urls.length ? urls[0].substring(4) : null,
    };
  });
}

// Async component cache.
const componentCache = {};

function clearCache() {
  Object.keys(componentCache).forEach((key) => {
    delete componentCache[key];
  });
}

function loadComponents(routes) {
  const components = routes.map(({ route, match }) => {
    const cachedComponent = componentCache[route.component];
    return cachedComponent
      ? Promise.resolve({
        match,
        route,
        component: cachedComponent,
      })
      : route.component().then((module) => {
        const component = module.default;
        componentCache[route.component] = component;
        return {
          match,
          route,
          component,
        };
      });
  });
  return Promise.all(components);
}

const renderRoutes = routes => (
  <Switch>
    {routes.map((route, i) => (
      <Route
        key={i.toString()}
        path={route.path}
        exact={route.exact}
        render={(props) => {
          const Component = componentCache[route.component];
          return (<Component {...props} routes={route.routes} />);
        }}
      />
    ))}
  </Switch>
);

export {
  clearCache,
  applyHook,
  loadComponents,
  renderRoutes,
};
