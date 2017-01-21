export default function ({ store, components, location, params }) {
  const functions = (components || []).reduce((prev, current) =>
    (current && current.fetchData ? [current.fetchData] : []).concat(prev)
  , []);

  const dispatch = store.dispatch;
  const promises = functions.map(func => func({
    dispatch,
    location,
    params,
  }));
  return Promise.all(promises);
}
