import { readFileSync } from 'fs';
import { resolveApp } from './paths';

const debug = process.env.NODE_ENV === 'development';

const isProd = () => !debug;

let bundle = null;
if (debug) {
  bundle = file => `http://127.0.0.1:${process.env.DEV_PORT}/${file}`;
} else {
  const manifest = JSON.parse(readFileSync(resolveApp(process.env.MANIFEST_PATH)));
  bundle = file => `/${manifest[file] || file}`;
}

export default {
  isProd,
  bundle,
};
