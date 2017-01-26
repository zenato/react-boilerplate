process.env.NODE_ENV = 'production';

if (!process.env.SKIP_LOAD_ENV && require('dotenv').config().error) {
   return process.exit(0);
}

const EventEmitter = require('events');
const webpack = require('webpack');
const del = require('del');
const ora = require('ora');
const { red, yellow, blue } = require('chalk');
const clientConfig = require('./config/webpack/client.js');
const serverConfig = require('./config/webpack/server.js');
const paths = require('./config/paths');
const clearConsole = require('./utils/clearConsole');
const formatWebpackMessages= require('./utils/formatWebpackMessages');

class Emitter extends EventEmitter {}
const emitter = new Emitter();

// Only production build messages.
function printPrettyMessages(messages, spinner, buildTarget) {
  if (messages.errors.length) {
    spinner.fail(red(`Failed to ${buildTarget} compile.`));
    console.log();
    messages.errors.forEach(message => console.log(message));
    return;
  }

  if (messages.warnings.length) {
    spinner.succeed(yellow(`Compiled ${buildTarget} with warnings.`));
    console.log();
    messages.warnings.forEach(message => console.log(message));
  }

  if (!messages.errors.length && !messages.warnings.length) {
    spinner.succeed(blue(`Successfully ${buildTarget} compiled.`));
  }
}

function configureClient() {
  const compiler = webpack(clientConfig);
  const spinner = ora('Compiling client.');

  compiler.plugin('compile', () => {
    if (!process.env.HEROKU) {
      clearConsole();
    } else {
      console.log();
    }
    spinner.start();
  });
  compiler.plugin('done', (stats) => {
    const messages = formatWebpackMessages(stats.toJson({}, true));
    printPrettyMessages(messages, spinner, 'client');
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
  const spinner = ora('Compiling server.');

  compiler.plugin('compile', () => spinner.start());
  compiler.plugin('done', (stats) => {
    const messages = formatWebpackMessages(stats.toJson({}, true));
    printPrettyMessages(messages, spinner, 'server');
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
