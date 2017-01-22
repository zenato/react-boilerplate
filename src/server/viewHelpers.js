import { readFileSync } from 'fs';
import { resolveApp } from './paths';

const debug = process.env.NODE_ENV === 'development';

function getBundleLoader() {
  if (debug) {
    return path => `http://127.0.0.1:${process.env.DEV_PORT}/${path}`;
  }
  const manifest = JSON.parse(readFileSync(resolveApp(process.env.MANIFEST_PATH)));
  return path => `/${manifest[path] || path}`;
}

const bundle = getBundleLoader();

export {
  bundle, // eslint-disable-line
};
