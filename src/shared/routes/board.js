import auth from './hooks/auth';
import { loadRoute, loadIndexRoute } from '../lib/router';

export default function (store) {
  const form = {
    path: 'new',
    onEnter: auth(store),
    getComponent(nextState, cb) {
      import('../containers/board/BoardForm').then(loadRoute(cb));
    },
  };

  const view = {
    path: ':id',
    getComponent(nextState, cb) {
      import('../containers/board/BoardView').then(loadRoute(cb));
    },
  };

  const edit = {
    path: 'edit/:id',
    onEnter: auth(store),
    getComponent(nextState, cb) {
      import('../containers/board/BoardForm').then(loadRoute(cb));
    },
  };

  return ({
    path: 'board',
    getComponent(nextState, cb) {
      import('../containers/board/BoardApp').then(loadRoute(cb));
    },
    getIndexRoute(nextState, cb) {
      import('../containers/board/BoardList').then(loadIndexRoute(cb));
    },
    getChildRoutes(nextState, cb) {
      cb(null, [form, view, edit]);
    },
  });
}
