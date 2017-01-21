const loadRoute = cb => module => cb(null, module.default);
const loadIndexRoute = cb => module => cb(null, { component: module.default });

export {
  loadRoute,
  loadIndexRoute,
};
