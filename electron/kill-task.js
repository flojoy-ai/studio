/* eslint-disable @typescript-eslint/no-var-requires */
const killProcess =async (port) => {
  const getFkill = async () => ((await import('tree-kill')).default)
  const fkill = await getFkill();
  return fkill(port) 
}

module.exports = { killProcess }