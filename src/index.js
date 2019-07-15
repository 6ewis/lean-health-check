/**
 * Module to build health check functions which comply with the FT health check standard.
 * @module @altruist/health-check
 */
'use strict';

import Base from './check/base';
import mergeDeepLeft from 'ramda/src/mergeDeepLeft';

/**
 * Class representing a set of health checks.
 */
export default class HealthCheck {
  /**
   * Create a health check set.
   * @param {Object} options - The health check set options.
   * @param {Array} options.checks - An array of health check configurations.
   * @param {Object} [options.log=console] - A logging object.
   * @throws {TypeError} Will throw if any options are invalid.
   */
  constructor(options) {
    this.options = mergeDeepLeft({}, options, HealthCheck.defaultOptions);
  }

  async runAllHealthCheck() {
    this.checkObjects = await Promise.all(
      this.options.checks.map(async (checkOptions) => {
        checkOptions.log = this.options.log;

        if (!Object.prototype.hasOwnProperty.call(HealthCheck.checkTypeMap, checkOptions.type)) {
          throw new TypeError(`Invalid check type: ${checkOptions.type}`);
        }

        const CheckTypeClass = HealthCheck.checkTypeMap[checkOptions.type];
        const healthCheck = new CheckTypeClass(checkOptions);
        await healthCheck.start();
        return healthCheck;
      }),
    );

    this.log = this.options.log;
  }

  /**
   * Get a status
   * @returns a promise that resolves to a boolean indicating whether all the health checks are OK.
   */
  async status() {
    await this.runAllHealthCheck();
    const ok = this.toJSON()
      //false will be the resolved value if any of the health checks with severity 1 are failing.
      .filter((check) => check.severity === 1)
      .every((check) => check.ok);
    return Promise.resolve(ok);
  }

  /**
   * Stop all of the checks from running, calling the `stop` method of each.
   * @returns {undefined}
   */
  stop() {
    this.checkObjects.forEach((check) => {
      if (check.isRunning()) {
        check.stop();
      }
    });
  }

  /**
   * Get a JSON representation of the health check set.
   * @access private
   * @returns {Object} The health check set as a JSON-friendly object.
   */
  toJSON() {
    return this.checkObjects.map((check) => check.toJSON());
  }

  /**
   * Get console-friendly representation of the health check set.
   * @access private
   * @returns {String} The console-friendly representation.
   */
  inspect() {
    const inspect = this.checkObjects.map((check) => `  ${check.inspect()}`);
    inspect.unshift(`${this.constructor.name} {`);
    inspect.push('}');
    return inspect.join('\n');
  }
}

/**
 * HealthCheck option defaults. This will be merged with user options.
 * @access private
 */
HealthCheck.defaultOptions = {
  checks: [],
  log: console,
};

/**
 * HealthCheck type to class map.
 * @access private
 */
HealthCheck.checkTypeMap = {
  get http() {
    return require('./check/http');
  },
};

/**
 * HealthCheck Base class.
 * @access public
 */
HealthCheck.Check = Base;
