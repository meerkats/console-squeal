var _ = require('underscore');
var async = require('async');
var sentry = require('winston-sentry');
var winston = require('winston');
var logger = new winston.Logger({
    colors: module.exports.colors,
    levels: module.exports.levels
});

module.exports.sentry_dsn = null;

module.exports.sentry_enabled = true;

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

module.exports.transports = {
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

//Override the all of the console methods with the Winstons logger methods
var log_methods = ['debug', 'info', 'warn', 'error'];
log_methods.forEach(function (current, index, array) {
    console[current] = function() {
        return logger[current].apply(current, arguments);
    };
});

//Override the console log and send it through to the logger info method.
console.log =  function () {
    return logger.info(arguments['0']);
};

/**
 * Creates the transports for Winston that are passed in.
 * Additional propertioes necessary for sentry use.
 * @param {array} Names of the transports that need to be created.
 * @param {object} Sentry dns and enabled status
 */
module.exports.createLoggers = function (transports, next) {
    async.each(transports, function (item, callback) {
        if (item === 'sentry') {
            if (!module.exports.sentry_dsn) {
                callback(new Error('No Sentry dsn defined'));
            }
            logger.add(module.exports.transports[item].transport,
                        _.extend(module.exports.transports[item].args, {
                            dsn: module.exports.sentry_dsn,
                            enabled: module.exports.sentry_enabled
                        }));
        } else {
            logger.add(module.exports.transports[item].transport,
                        module.exports.transports[item].args);
        }
        return callback();
    }, next);
};
