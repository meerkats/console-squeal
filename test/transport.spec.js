const expect = require('chai').expect;
const squeal = require('../index');

describe('#createLoggers', function () {
  afterEach(function () {
    squeal.removeLogger('sentry');
  });
  it('Should fail when no Sentry DSN is given', function () {
    squeal.createLoggers(['sentry'], function (err) {
      expect(err).not.to.be.null;
    });
  });
  it('Should not fail if valid Sentry DSN is given', function () {
    squeal.sentryDsn = 'https://366f412ff7664f44891889321c8925eb:ff8d68e117804bd28776c0c2ee3cb9b1@app.getsentry.com/4291';
    squeal.createLoggers(['sentry'], function (err) {
      expect(err).not.to.be.null;
    });
  });
});
