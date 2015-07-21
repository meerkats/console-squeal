# squeal
Winston wrapper for overriding console commands, with Sentry support, in NodeJS

# Install

`npm install squeal`

# Usage

```
var squeal = require('squeal');
squeal.sentry_dsn = 'my_sentry_dsn';
squeal.createLoggers(['console', 'file', 'sentry']);
```
All subsequent calls to console.log/debug/info/warm/error will be handled by the Winston
transporters that were passed in to the `squeal.createLoggers` function.

## Access transport options

```
var squeal = require('squeal');

//Each of the following transports should suppory standard Winston sentry 
//options, for example: level, colors, colorize, silent

//Modify Console transport
squeal.transports.Console[Option];

//Modify File transport
squeal.transports.File[Option];

//Modify Sentry transport
squeal.transports.Sentry[Option];
```

## Access Winston global settings

```
var squeal = require('squeal');

//Modify colors
squeal.colors = { 
    error: 'red',
    info: 'green', 
    warn: 'blue'
};

//Modify levels = {
    error: 3,
    warn: 2,
    info: 1
};

# Author

This repo is created and maintained by MEERKATS in SUBIACO, WESTERN AUSTRALIA.
