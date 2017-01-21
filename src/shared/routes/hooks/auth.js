export default store => ({ location }, replace, callback) => {
  const { user } = store.getState();
  if (!user.signedInfo) {
    const next = encodeURIComponent(location.pathname + location.search);
    replace(`/signIn?next=${next}`);
  }
  callback();
};
