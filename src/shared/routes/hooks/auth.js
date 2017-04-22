const SIGNIN_URL = '/signIn';

export default store => ({ location }) => {
  const user = store.getState().user;
  if (user.signedInfo) {
    return null;
  }
  const next = encodeURIComponent(location.pathname + location.search);
  return `url:${SIGNIN_URL}?next=${next}`;
};
