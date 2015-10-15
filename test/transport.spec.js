const expect = require('chai').expect;
const squeal = require('../index');

describe('Squeal', function () {
  describe('#removeLogger', function () {
    it('Should fail to remove transport if it has no been created', function () {
      expect(squeal.removeLogger.bind(squeal, 'fakeTransport')).to.throw(Error);
    });
    it('Should remove transport if it has been created', function () {
      squeal.createLoggers(['console']);
      expect(squeal.removeLogger.bind(squeal, 'console')).to.not.throw(Error);
    });
  });
  describe('#createLoggers', function () {
    it('Should fail when no Sentry DSN is given', function () {
      squeal.createLoggers(['sentry']);
      expect(squeal.removeLogger.bind(squeal, 'sentry')).to.throw(Error);
    });
    it('Should not fail if valid Sentry DSN is given', function () {
      squeal.sentryDsn = 'https://366f412ff7664f44891889321c8925eb:ff8d68e117804bd28776c0c2ee3cb9b1@app.getsentry.com/4291';
      squeal.createLoggers(['sentry']);
      expect(squeal.removeLogger.bind(squeal, 'sentry')).to.not.throw(Error);
    });
    it('Should fail when no Slack webhook is given', function () {
      squeal.createLoggers(['slack']);
      expect(squeal.removeLogger.bind(squeal, 'slack')).to.throw(Error);
    });
    it('Should not fail if valid Slack webhook is given', function () {
      squeal.slackOptions.webhook = 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';
      squeal.createLoggers(['slack']);
      expect(squeal.removeLogger.bind(squeal, 'slack')).to.not.throw(Error);
    });
  });
});
