import { join } from 'path';

const appRoot = process.cwd();
const resolveApp = relativePath => join(appRoot, relativePath);

export {
  resolveApp, // eslint-disable-line
};
