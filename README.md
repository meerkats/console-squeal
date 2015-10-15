# console-squeal

Winston wrapper for overriding console commands with Sentry and Slack support in nodejs.

# Install

```bash
npm install console-squeal
```

# Usage

```js
var squeal = require('console-squeal');
squeal.sentryDsn = 'my_sentry_dsn';
squeal.slackOptions.webhook = 'my_slack_webhook';
squeal.createLoggers(['console', 'file', 'sentry', 'slack']).start();
```

All subsequent calls to console.log/debug/info/warn/error will be handled by the Winston
transporters that were passed in to the `squeal.createLoggers` function.

To revert back to original console behavior.

```js
squeal.stop();
```

# Author

This repo is created and maintained by Meerkats in Subiaco, Western Australia.
