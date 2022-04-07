const chalk = require('chalk');

module.exports = {
  heading (text) {
    console.info(chalk.underline.bold(`${text}\n`));
  },

  info (message) {
    console.info(message);
  },

  debug (message) {
    console.debug(chalk.gray(message));
  },

  warning (message) {
    console.warn(`${chalk.yellow('Warning')}: ${message}`);
  },

  error (message) {
    console.error(this.formatError(message));
  },

  formatError (message) {
    return `${chalk.bold.red('Error')}: ${message}`;
  }
};
