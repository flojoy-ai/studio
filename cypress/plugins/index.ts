/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config)
  return config
}