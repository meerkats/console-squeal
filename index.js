var _ = require('underscore');
var async = require('async');
var sentry = require('winston-sentry');
var winston = require('winston');
var logger = new winston.Logger({
    colors: module.exports.colors,
    levels: module.exports.levels
});

module.exports.sentry_dsn = null;

module.exports.colors = {
    debug: 'white',
    info: 'green',
    warn: 'yellow',
    error: 'red'
};

module.exports.levels = {
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

/**
 * Overrides the default console logging methods log, warn and error.
 */
var registerConsole  = function () {
    //Override the all of the console methods with the Winstons logger methods
    Object.keys(module.exports.levels).forEach(function (level, index, array) {
        console[level] = function () {
            return logger[level].apply(level, arguments);
        };
    });

    //Override the console log and send it through to the logger info method.
    console.log =  function () {
        return logger['info'].apply('info', arguments);
    };
}

/**
 * Creates the transports for Winston that are passed in.
 * Additional propertioes necessary for sentry use.
 * @param {array} Names of the transports that need to be created.
 * @param {object} Sentry dns and enabled status
 */
module.exports.createLoggers = function (transport_names, next) {
    //Before we create the extra loggers we need to ensure that Squeal has overridden
    //all of the console methods.
    registerConsole();
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
