Http Health Check
=================

Lean fork of FT health check standard. 
  - Declarative initialization.
  - Added HTTP health check without any form of caching from HTTP1.0/HTTP2.0
  - Added #retry, the ability to check an endpoint as many times as wanted on failures
  - Removed default intervals health checking
  - Removed the noise from the original lib to keep it lean, and leave it to  kubernetes to
   handle the cpu, memory usage checks.  
  - Removed Ping and Tcp/ip checks

Table Of Contents
-----------------

  - [Usage](#usage)
    - [Requirements](#requirements)
    - [API Documentation](#api-documentation)
    - [Options](#options)
    - [Health Check Configurations](#health-check-configurations)
    - [Examples](#examples)
    - [Node Fetch](#node-fetch)
  - [Contributing](#contributing)
  - [Publishing](#publishing)
  - [Contact](#contact)
  - [Licence](#licence)


Usage
-----

### Requirements

Running the Health Check module requires [Node.js] 6.x and [npm]. You can install with:

```sh
yarn add lean-health-check
```

### API Documentation

This library makes use of [promises] – familiarity is assumed in the rest of the API documentation. You'll also need to require the module with:

```js
import HealthCheck from 'lean-health-check';
```

### `new HealthCheck( [options] )`

This function returns a new health check object. You can configure the health checks with [an options object](#options) if you need to override any defaults.

```js
const health = new HealthCheck({
    checks: [
        // ...
    ]
});
```

The [given checks](#health-check-configurations) start polling immediately at the intervals that you specify. The returned instance has several methods for reading this data.

#### `health.status()`

The returned function returns a promise which resolves to either `true` or `false`.

`false` will be the resolved value if any of the health checks with severity `1` are failing.

Assuming you've already included [Express] and [Express Web Service]:

#### `health.toJSON()`

Get the health check output as an array that's safe for converting to JSON. You can use this if you don't intend on using the [Express Web Service] module.

#### `health.stop()`

This stops all of the checks from running. This is useful if the health checks are keeping the Node.js process open and you need it to close. E.g. after integration tests.

```js
health.stop();
```

### `new HealthCheck.Check( [options] )`

This class is used to create custom health checks. You'll need to extend this class in order to use it, and can pass instances directly into `HealthCheck` when you instantiate it. E.g.

```js
class MyHealthCheck extends HealthCheck.Check {

    constructor(options) {
        super(options);
    }

    // Must return a promise
    run() {
        return new Promise(resolve => {
            // Must set these properties
            this.ok = true;
            this.checkOutput = '';
            this.lastUpdated = new Date();
            resolve();
        });
    }

}
```

[See examples](#examples) for more information, or look through [`lib/check`](lib/check) for more classes which already extend the base Check class.


### Options

The Health Check module can be configured with a variety of options, passed in as an object to the `HealthCheck` constructor. The available options are as follows:

  - `checks`: An array of [health check configuration objects](#health-check-configurations). Defaults to an empty array
  - `log`: A console object used to output logs. Defaults to the global `console` object

### Health Check Configurations

Each health check can be configured as an object. These follow the [FT health check standard], which has more information, and there are [examples](#examples) available to help you out. No matter what type of check you're adding, there are some common required properties:

  - `type`: The type of the check. default to `http`.
  - `businessImpact`: The business impact of the health check as a string
  - `id`: The unique ID of the health check as a string. Must use only lowercase alphanumeric characters and hyphens.
  - `name`: The name of the health check as a string.
  - `panicGuide`: The panic guide for the health check as a string.
  - `technicalSummary`: The technical summary for the health check as a string.

There are also some common optional properties:

  - `severity`: The severity level of the health check if it is failing. Must be one of `1` (high), `2` (medium), `3` (low)
  - `interval`: The number of milliseconds to wait between checks. Defaults to `0` (0 seconds)

Different types of check may have additional config properties. These are documented below.

Contributing
------------

This module has a full suite of unit tests, and is verified with ESLint. You can use the following commands to check your code before opening a pull request.

```sh
make verify  # verify JavaScript code with ESLint
make test    # run the unit tests and check coverage
```

Contact
-------

If you have any questions or comments about this module, or need help using it, please either [raise an issue][issues], email [Support].


Licence
-------

This software is published by Altruist under the [MIT licence][license].


[express]: https://expressjs.com/
[Altruist health check standard]:
[issues]: https://github.com/6ewis/http-health-check/issues
[license]: http://opensource.org/licenses/MIT
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[support]: mailto:ldackam@altruist.com
