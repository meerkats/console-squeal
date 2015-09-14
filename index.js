var _ = require('underscore');
var sentry = require('winston-sentry');
var winston = require('winston');
var logger = new winston.Logger({
    colors: module.exports.colors,
    levels: module.exports.levels
});

var sentry_dsn = null;

var colors = {
    debug: 'white',
    info: 'green',
    warn: 'yellow',
    error: 'red'
};

var levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};

var transports = {
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

var default_console_functions = {};

/**
 * Overrides the default console logging methods (debug, log, warn and error) to pass arguments to releveant
 * winston logger functions
 */
function start() {
    //Override the all of the console methods with the Winstons logger methods
    Object.keys(module.exports.levels).forEach(function (level) {
        default_console_functions[level] = {
            name: level,
            func: console[level]
        };
        console[level] = function () {
            logger[level].apply(level, arguments);
        };
    });
    //Override the console log and send it through to the logger info method.
    default_console_functions.log = {
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
    Object.keys(default_console_functions).forEach(function (level) {
        console[level] = default_console_functions[level].func;
    });
    return module.exports;
}

/**
 * Creates the transports for Winston that are passed in.
 * Additional propertioes necessary for sentry use.
 * @param {array} Names of the transports that need to be created.
 * @param {object} Sentry dns and enabled status
 */
function createLoggers(transport_names) {
    transport_names.forEach(function (transport) {
        if (transport === 'sentry') {
            if (!module.exports.sentry_dsn) {
                console.error('No Sentry dsn defined');
            }
            logger.add(module.exports.transports[transport].transport,
                       _.extend(module.exports.transports[item].args, {
                           dsn: module.exports.sentry_dsn,
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
    start: start,
    stop: stop,
    colors: colors,
    levels: levels,
    sentry_dsn: sentry_dsn,
    transports: transports
};
