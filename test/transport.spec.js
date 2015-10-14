const expect = require('chai').expect;
const squeal = require('../index');

describe('#createLoggers', function () {
  it('Should fail when no Sentry DSN is given', function () {
    squeal.createLoggers(['sentry']);
    expect(function () {
      squeal.removeLogger('sentry');
    }).to.throw(Error);
  });
  it('Should not fail if valid Sentry DSN is given', function () {
    squeal.sentryDsn = 'https://366f412ff7664f44891889321c8925eb:ff8d68e117804bd28776c0c2ee3cb9b1@app.getsentry.com/4291';
    squeal.createLoggers(['sentry']);
    expect(function () {
      squeal.removeLogger('sentry');
    }).to.not.throw(Error);
  });
  it('Should fail when no Slack webhook is given', function () {
    squeal.createLoggers(['slack']);
    expect(function () {
      squeal.removeLogger('slack');
    }).to.throw(Error);
  });
  it('Should not fail if valid Slack webhook is given', function () {
    squeal.slackOptions.webhook = 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';
    squeal.createLoggers(['slack']);
    expect(function () {
      squeal.removeLogger('slack');
    }).to.not.throw(Error);
  });
});
