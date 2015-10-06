const _ = require('underscore');
const sentry = require('winston-sentry');
const winston = require('winston');
const colors = {
  debug: 'white',
  info: 'green',
  warn: 'yellow',
  error: 'red'
};

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};
var logger = new winston.Logger({
  colors: colors,
  levels: levels
});

var sentryDsn = null;

const transports = {
  console: {
    transport: winston.transports.Console,
    args: {
      level: 'info',
      colorize: true,
      timestamp: true,
      handleExceptions: true,
      prettyPrint: true,
      silent: false
    }
  },
  file: {
    transport: winston.transports.File,
    args: {
      filename: 'app.log',
      level: 'debug',
      colorize: true,
      timestamp: true,
      handleExceptions: true
    }
  },
  sentry: {
    transport: sentry,
    args: {
      level: 'error',
      colorize: true,
      timestamp: true,
      handleExceptions: true,
      prettyPrint: true,
      silent: false
    }
  }
};

var defaultConsoleFunctions = {};

/**
 * Overrides the default console logging methods (debug, log, warn and error) to pass arguments to releveant
 * winston logger functions
 */
function start() {
  // Override the all of the console methods with the Winstons logger methods
  Object.keys(levels).forEach(function (level) {
    defaultConsoleFunctions[level] = {
      name: level,
      func: console[level]
    };
    console[level] = function () {
      logger[level].apply(level, arguments);
    };
  });
  // Override the console log and send it through to the logger info method.
  defaultConsoleFunctions.log = {
    name: 'log',
    func: console.log
  };
  console.log =  function () {
    logger.info.apply('info', arguments);
  };
  return module.exports;
}

/**
 * Restores default console method behavior
 */
function stop() {
  Object.keys(defaultConsoleFunctions).forEach(function (level) {
    console[level] = defaultConsoleFunctions[level].func;
  });
  return module.exports;
}

/**
 * Removes a transports from Winston.
 * @param {string} Name of the transport to remove
 * @param {object} Sentry dns and enabled status
 */
function removeLogger(transportName) {
  logger.remove(transportName);
}

/**
 * Creates the transports for Winston that are passed in.
 * Additional propertioes necessary for sentry use.
 * @param {array} Names of the transports that need to be created.
 * @param {object} Sentry dns and enabled status
 */
function createLoggers(transportNames) {
  logger = new winston.Logger({
    colors: colors,
    levels: levels
  });
  transportNames.forEach(function (transport) {
    if (transport === 'sentry') {
      if (!module.exports.sentryDsn) {
        console.error('No Sentry dsn defined');
      }
      logger.add(module.exports.transports[transport].transport,
                 _.extend(module.exports.transports[transport].args, {
                   dsn: module.exports.sentryDsn,
                   enabled: true
                 }));
    }
    else {
      logger.add(module.exports.transports[transport].transport,
                 module.exports.transports[transport].args);
    }
  });
  return module.exports;
}

module.exports = {
  createLoggers: createLoggers,
  removeLogger: removeLogger,
  start: start,
  stop: stop,
  sentryDsn: sentryDsn,
  transports: transports
};
