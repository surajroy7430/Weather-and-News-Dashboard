const chalk = require("chalk").default;

const colorizeMethod = (method, text) => {
  switch (method) {
    case "GET":
      return chalk.green(text);
    case "POST":
      return chalk.magenta(text);
    case "PUT":
    case "PATCH":
      return chalk.yellow(text);
    case "DELETE":
      return chalk.red(text);
    default:
      return chalk.white(text);
  }
};

const colorizeStatus = (status) => {
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.hex("#ffa500")(status);
  if (status >= 300) return chalk.cyan(status);
  if (status >= 200) return chalk.green(status);
  return chalk.white(status);
};

const colorizeTime = (time) => {
  const ms = parseFloat(time);
  if (ms < 100) return chalk.green(`${ms} ms`);
  if (ms < 1000) return chalk.yellow(`${ms} ms`);
  return chalk.red(`${ms} ms`);
};

module.exports = { colorizeMethod, colorizeStatus, colorizeTime };