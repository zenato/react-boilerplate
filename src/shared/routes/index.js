import { loadRoute, loadIndexRoute } from '../lib/router';
import App from '../containers/App';
import boardRoute from './board';
import auth from './hooks/auth';

export default function (store) {
  const signIn = {
    path: 'signIn',
    getComponent(nextState, cb) {
      System.import('../containers/user/SignIn').then(loadRoute(cb));
    },
  };

  const signUp = {
    path: 'signUp',
    getComponent(nextState, cb) {
      System.import('../containers/user/SignUp').then(loadRoute(cb));
    },
  };

  const setting = {
    path: 'setting',
    onEnter: auth(store),
    getComponent(nextState, cb) {
      System.import('../containers/user/Setting').then(loadRoute(cb));
    },
  };

  const board = boardRoute(store);

  return ({
    childRoutes: [
      {
        path: '/',
        component: App,
        getIndexRoute(nextState, cb) {
          System.import('../containers/Main').then(loadIndexRoute(cb));
        },
        childRoutes: [
          signIn,
          signUp,
          setting,
          board,
        ],
      },
    ],
  });
}
