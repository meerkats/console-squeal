var squeal = require('../index');

describe('Squeal sentry setup', function () {
    it('Should fail when no Sentry DSN is given', function () {
        squeal.createLoggers(['sentry'], function (err) {
            expect(err).not.toBe(null);
        });
    });
    it('Should not fail if valid Sentry DSN is given', function () {
        squeal.sentry_dsn = 'https://366f412ff7664f44891889321c8925eb:ff8d68e117804bd28776c0c2ee3cb9b1@app.getsentry.com/4291';;
        squeal.createLoggers(['sentry'], function (err) {
            expect(err).toBe(null);
        });
    });
});