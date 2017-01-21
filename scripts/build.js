process.env.NODE_ENV = 'production';

if (!process.env.SKIP_LOAD_ENV && require('dotenv').config().error) {
   return process.exit(0);
}

const EventEmitter = require('events');
const webpack = require('webpack');
const del = require('del');
const { red, yellow, blue, green } = require('chalk');
const clientConfig = require('./config/webpack/client.js');
const serverConfig = require('./config/webpack/server.js');
const paths = require('./config/paths');
const clearConsole = require('./utils/clearConsole');
const formatWebpackMessages= require('./utils/formatWebpackMessages');

class Emitter extends EventEmitter {}
const emitter = new Emitter();

// Only production build messages.
function printPrettyMessages(messages) {
  if (messages.errors.length) {
    console.log(red('Failed to compile.'));
    console.log();
    messages.errors.forEach(message => console.log(message));
    console.log();
    return;
  }

  if (messages.warnings.length) {
    console.log(yellow('Compiled with warnings.'));
    console.log();
    messages.warnings.forEach(message => console.log(message));
    console.log();
  }

  if (!messages.errors.length && !messages.warnings.length) {
    console.log(blue('Successfully compiled.'));
    console.log();
  }
}

function configureClient() {
  const compiler = webpack(clientConfig);

  compiler.plugin('compile', () => {
    if (!process.env.HEROKU) {
      clearConsole();
    } else {
      console.log();
    }
    console.log(green('Compiling client.'));
  });
  compiler.plugin('done', (stats) => {
    const messages = formatWebpackMessages(stats.toJson({}, true));
    printPrettyMessages(messages);
    if (!messages.errors.length) {
      emitter.emit('server-compile');
    }
  });

  emitter.on('client-compile', () => {
    compiler.run(() => {});
  });
}

function configureServer() {
  const compiler = webpack(serverConfig);

  compiler.plugin('compile', () => {
    console.log(green('Compiling server.'));
  });
  compiler.plugin('done', (stats) => {
    const messages = formatWebpackMessages(stats.toJson({}, true));
    printPrettyMessages(messages);
  });

  emitter.on('server-compile', () => {
    compiler.run(() => {});
  });
}

// Start
del.sync(paths.build);
configureClient();
configureServer();

emitter.emit('client-compile');
