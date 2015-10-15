# console-squeal

Winston wrapper for overriding console commands with Sentry and Slack support in nodejs.

# Install

```bash
npm install console-squeal
```

# Usage

```js
var squeal = require('console-squeal');
squeal.sentry_dsn = 'my_sentry_dsn';
squeal.createLoggers(['console', 'file', 'sentry']).start();
```

All subsequent calls to console.log/debug/info/warm/error will be handled by the Winston
transporters that were passed in to the `squeal.createLoggers` function.

To revert back to original console behavior.

```js
squeal.stop();
```

## Access transport options

```js
var squeal = require('console-squeal');

// Each of the following transports should suppory standard Winston sentry
// options, for example: level, colors, colorize, silent

// Modify Console transport
squeal.transports.Console[Option];

// Modify File transport
squeal.transports.File[Option];

// Modify Sentry transport
squeal.transports.Sentry[Option];
```

## Access Winston global settings

```js
var squeal = require('console-squeal');

// Modify colors
squeal.colors = {
    error: 'red',
    info: 'green',
    warn: 'blue'
};

// Modify levels
squeal.levels = {
    error: 3,
    warn: 2,
    info: 1
};
```

# Author

This repo is created and maintained by Meerkats in Subiaco, Western Australia.
