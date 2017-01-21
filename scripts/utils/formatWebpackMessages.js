/**
 * WARNING: this code is untranspiled and is used in browser too.
 */

function formatMessage(message) {
  var cleanedLine = [];
  var lines = message.split('\n');

  lines.forEach(function(line, index) {
    if (index === 1) {
      // Replace module build faile message
      return cleanedLine.push(line.replace(
        'Module build failed: ', ''
      ).replace(
        'SyntaxError:', 'Syntax error:'
      ));
    }

    // Replace module path.
    if (line.startsWith(' @ ')) {
      return;
    }

    cleanedLine.push(line);
  });

  return cleanedLine.join('\n').trim();
}

function formatWebpackMessages(stats) {
  var formatedErrors = (stats.errors || []).map(function(message) {
    return 'Error in ' + formatMessage(message);
  });

  var formatedWarnings = (stats.warnings || []).map(function(message) {
    return 'Warning in ' + formatMessage(message);
  });

  return {
    errors: formatedErrors,
    warnings: formatedWarnings,
  };
}

module.exports = formatWebpackMessages;
