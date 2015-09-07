var _ = require('underscore');
var async = require('async');
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

module.exports.transports = transports = {
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
var start = function () {
    //Override the all of the console methods with the Winstons logger methods
    async.forEachOf(module.exports.levels, function (level) {
        defaultConsoleFunctions[level] = {name: level, func: console[level]};
        console[level] = function () {
            return logger[level].apply(level, arguments);
        };
    });
    //Override the console log and send it through to the logger info method.
    defaultConsoleFunctions['log'] = {name: 'log', func: console['log']};
    console.log =  function () {
        return logger['info'].apply('info', arguments);
    };
}

/**
 * Restores default console method behavior
 */
var stop = function () {
    async.forEachOf(defaultConsoleFunctions, function (level) {
        console[level.name] = level.func;
    });
}

/**
 * Creates the transports for Winston that are passed in.
 * Additional propertioes necessary for sentry use.
 * @param {array} Names of the transports that need to be created.
 * @param {object} Sentry dns and enabled status
 */
var createLoggers = function (transport_names, next) {
    async.each(transport_names, function (item, callback) {
        if (item === 'sentry') {
            if (!module.exports.sentry_dsn) {
                return callback(new Error('No Sentry dsn defined'));
            }
            logger.add(transports[item].transport,
                       _.extend(transports[item].args, {
                           dsn: module.exports.sentry_dsn,
                           enabled: true
                       }));
        }
        else {
            logger.add(transports[item].transport,
                       transports[item].args);
        }
        return callback();
    }, next);
};

module.exports = {
    createLoggers: createLoggers,
    start: start,
    stop: stop,
    colors: colors,
    levels: levels,
    sentry_dsn: sentry_dsn,
    transports: transports
};
