import { readFileSync } from 'fs';
import { resolveApp } from './paths';

const debug = process.env.NODE_ENV === 'development';

function loadBundle() {
  if (debug) {
    return path => `http://0.0.0.0:${process.env.DEV_PORT}/${path}`;
  }
  const manifest = JSON.parse(readFileSync(resolveApp(process.env.MANIFEST_PATH)));
  return path => `/${manifest[path] || path}`;
}

const bundle = loadBundle();

export {
  bundle, // eslint-disable-line
};
