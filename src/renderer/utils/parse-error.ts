export const parseElectronError = (err: string) => {
  const removeDefaultMsg = err
    .replace(/^(Error:)/, "")
    .replace(/^(Error occurred in handler for)/, "")
    .replace(/^(Error invoking remote method)/, "");
  return removeDefaultMsg.split(":").slice(1).join(":") ?? "";
};
