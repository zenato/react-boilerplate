export default function ({ store, components, location }) {
  const dispatch = store.dispatch;

  const promises = components.map(({ component, match }) => {
    if (component.fetchData) {
      return component.fetchData({
        dispatch,
        location,
        match,
      });
    }
    return Promise.resolve();
  });

  return Promise.all(promises);
}
