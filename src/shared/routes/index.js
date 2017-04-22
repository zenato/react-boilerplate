import auth from './hooks/auth';

export default store => [
  {
    path: '/',
    exact: true,
    component: () => import('../containers/Main'),
  },
  {
    path: '/signIn',
    component: () => import('../containers/user/SignIn'),
  },
  {
    path: '/signUp',
    component: () => import('../containers/user/SignUp'),
  },
  {
    path: '/setting',
    component: () => import('../containers/user/Setting'),
  },
  {
    path: '/board',
    component: () => import('../containers/board/BoardApp'),
    routes: [
      {
        path: '/board',
        exact: true,
        component: () => import('../containers/board/BoardList'),
      },
      {
        path: '/board/new',
        enter: auth(store),
        component: () => import('../containers/board/BoardForm'),
      },
      {
        path: '/board/edit/:id',
        enter: auth(store),
        component: () => import('../containers/board/BoardForm'),
      },
      {
        path: '/board/:id',
        component: () => import('../containers/board/BoardView'),
      },
    ],
  },
];
