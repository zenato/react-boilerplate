let isFirstClear = true;

function clearConsole() {
  process.stdout.write(isFirstClear ? '\x1bc' : '\x1b[2J\x1b[0f');
  isFirstClear = false;
}

module.exports = clearConsole;
