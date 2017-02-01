const loadRoute = cb => module => cb(null, module.default);
const loadIndexRoute = cb => module => cb(null, { component: module.default });

const isChangedLocation = (currentLocation, nextLocation) => {
  const currentUrl = currentLocation.pathname + currentLocation.search;
  const nextUrl = nextLocation.pathname + nextLocation.search;
  return currentUrl !== nextUrl;
};

export {
  loadRoute,
  loadIndexRoute,

  isChangedLocation,
};
