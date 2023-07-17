/* eslint-disable @typescript-eslint/no-var-requires */

const percyHealthCheck = require('@percy/cypress/task')

module.exports = (on, config) => {
  require("@cypress/code-coverage/task")(on, config);
  on("task", percyHealthCheck);
  return config;
};
