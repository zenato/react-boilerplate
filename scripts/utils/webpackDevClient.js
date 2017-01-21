/**
 * WARNING: this code is untranspiled and is used in browser too.
 */

var url = require('url');
var stripAnsi = require('strip-ansi');
var socket = require('webpack-dev-server/client/socket');
var formatWebpackMessages = require('./formatWebpackMessages');

// Hidden all default WDS, HMR messages.
var quiet = true;

// Modified from 'webpack-dev-server/client'

function getCurrentScriptSource() {
  if (document.currentScript) {
    return document.currentScript.getAttribute('src');
  }
  var scriptElements = document.scripts || [];
  var currentScript = scriptElements[scriptElements.length - 1];
  if (currentScript) {
    return currentScript.getAttribute('src');
  }

  if (quiet) {
    throw new Error('Failed to get current script source');
  } else {
    throw new Error('[WDS] Failed to get current script source');
  }
}

var scriptHost = getCurrentScriptSource();
scriptHost = scriptHost.replace(/\/[^\/]+$/, '');
var urlParts = url.parse((scriptHost ? scriptHost : '/'), false, true);

var hot = false;
var initial = true;
var currentHash = '';
var logLevel = 'info';

function log(level, msg) {
  if (quiet) {
    return;
  }

  if (logLevel === 'info' && level === 'info') {
    return console.log(msg);
  }
  if (['info', 'warning'].indexOf(logLevel) >= 0 && level === 'warning') {
    return console.warn(msg);
  }
  if (['info', 'warning', 'error'].indexOf(logLevel) >= 0 && level === 'error') {
    return console.error(msg);
  }
}

var onSocketMsg = {
  hot: function() {
    hot = true;
    log('info', '[WDS] Hot Module Replacement enabled.');
  },
  invalid: function() {
    log('info', '[WDS] App updated. Recompiling...');
    if (quiet) {
      console.log('Compiling.');
    }
  },
  hash: function(hash) {
    currentHash = hash;
  },
  'still-ok': function() {
    log('info', '[WDS] Nothing changed.');
    if (quiet) {
      console.log('Successfully compiled.');
    }
  },
  'log-level': function(level) {
    logLevel = level;
  },
  ok: function() {
    if (initial) return initial = false;
    if (quiet) {
      console.log('Successfully compiled.');
    }
    reloadApp();
  },
  'content-changed': function() {
    log('info', '[WDS] Content base changed. Reloading...');
    self.location.reload();
  },
  warnings: function(warnings) {
    log('info', '[WDS] Warnings while compiling.');
    if (quiet) {
      console.log('Compiled with warnings.');
    }

    var formatedMessages = formatWebpackMessages({ errors: [], warnings: warnings });
    for (var i = 0; i < formatedMessages.warnings.length; i++) {
      console.warn(stripAnsi(formatedMessages.warnings[i]));
    }
    if (initial) {
      return initial = false;
    }
    reloadApp();
  },
  errors: function(errors) {
    log('info', '[WDS] Errors while compiling.');
    if (quiet) {
      console.log('Failed to compile.');
    }

    var  formatedMessages = formatWebpackMessages({ errors: errors, warnings: [] });
    for (var i = 0; i < formatedMessages.errors.length; i++) {
      console.error(stripAnsi(formatedMessages.errors[i]));
    }
    if (initial) {
      return initial = false;
    }
    reloadApp();
  },
  'proxy-error': function(errors) {
    log('info', '[WDS] Proxy error.');
    for (var i = 0; i < errors.length; i++) {
      log('error', stripAnsi(errors[i]));
    }
    if (initial) {
      return initial = false;
    }
  },
  close: function() {
    log('error', '[WDS] Disconnected!');
  }
};

var hostname = urlParts.hostname;
var protocol = urlParts.protocol;

if (urlParts.hostname === '0.0.0.0') {
  if (self.location.hostname && !!~self.location.protocol.indexOf('http')) {
    hostname = self.location.hostname;
  }
}

if (hostname && (self.location.protocol === 'https:' || urlParts.hostname === '0.0.0.0')) {
  protocol = self.location.protocol;
}

var socketUrl = url.format({
  protocol: protocol,
  auth: urlParts.auth,
  hostname: hostname,
  port: (urlParts.port === '0') ? self.location.port : urlParts.port,
  // pathname: urlParts.path == null || urlParts.path === '/' ? '/sockjs-node' : urlParts.path
  pathname: '/sockjs-node'
});

socket(socketUrl, onSocketMsg);

function reloadApp() {
  if (hot) {
    log('info', '[WDS] App hot update...');
    var hotEmitter = require('webpack/hot/emitter');
    hotEmitter.emit('webpackHotUpdate', currentHash);
    if (typeof self !== 'undefined') {
      self.postMessage('webpackHotUpdate' + currentHash, '*');
    }
  } else {
    log('info', '[WDS] App updated. Reloading...');
    self.location.reload();
  }
}

// Modified from 'webpack/hot/only-dev-server'

if (module.hot) {
  var lastHash;
  var upToDate = function upToDate() {
    return lastHash.indexOf(__webpack_hash__) >= 0;
  };
  var check = function check() {
    module.hot.check().then(function(updatedModules) {
      if (!updatedModules) {
        log('warning', '[HMR] Cannot find update. Need to do a full reload!');
        log('warning', '[HMR] (Probably because of restarting the webpack-dev-server)');
        return;
      }

      return module.hot.apply({
        ignoreUnaccepted: true,
        ignoreDeclined: true,
        ignoreErrored: true,
        onUnaccepted: function(data) {
          log('warning', 'Ignored an update to unaccepted module ' + data.chain.join(' -> '));
        },
        onDeclined: function(data) {
          log('warning', 'Ignored an update to declined module ' + data.chain.join(' -> '));
        },
        onErrored: function(data) {
          log('warning', 'Ignored an error while updating module ' + data.moduleId + ' (' + data.type + ')');
        }
      }).then(function(renewedModules) {
        if (!upToDate()) {
          check();
        }

        if (!quiet) {
          require('webpack/hot/log-apply-result')(updatedModules, renewedModules);
        }

        if (upToDate()) {
          log('info', '[HMR] App is up to date.');
        }
      });
    }).catch(function(err) {
      var status = module.hot.status();
      if (['abort', 'fail'].indexOf(status) >= 0) {
        log('warning', '[HMR] Cannot check for update. Need to do a full reload!');
        log('warning', '[HMR] ' + err.stack || err.message);
      } else {
        log('warning', '[HMR] Update check failed: ' + err.stack || err.message);
      }
    });
  };
  var hotEmitter = require('webpack/hot/emitter');
  hotEmitter.on('webpackHotUpdate', function(currentHash) {
    lastHash = currentHash;
    if (!upToDate()) {
      var status = module.hot.status();
      if (status === 'idle') {
        log('info', '[HMR] Checking for updates on the server...');
        check();
      } else if (['abort', 'fail'].indexOf(status) >= 0) {
        log('warning', '[HMR] Cannot apply update as a previous update ' + status + 'ed. Need to do a full reload!');
      }
    }
  });

  log('info', '[HMR] Waiting for update signal from WDS...');
} else {
  if (quiet) {
    throw new Error('Hot Module Replacement is disabled.');
  } else {
    throw new Error('[HMR] Hot Module Replacement is disabled.');
  }
}
