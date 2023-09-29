const getCloudSocketUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;
  }
  return null;
}
const getCloudBackendUri = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return null;
}
export const BACKEND_DEFAULT_PORT = 5392;
export const NODES_REPO = "https://github.com/flojoy-ai/nodes/blob/main";
export const DOCS_LINK = "https://docs.flojoy.ai";
const BACKEND_HOST = process.env.VITE_SOCKET_HOST || "127.0.0.1";
const BACKEND_PORT = process.env.VITE_BACKEND_PORT
  ? +process.env.VITE_BACKEND_PORT
  : 5392;
export const IS_CLOUD_DEMO =
  process.env.VITE_IS_CLOUD_DEMO?.toLowerCase() === "true";
// Can I get away with API_URI being /, or must I specify a protocol?
export const API_URI = IS_CLOUD_DEMO ? getCloudBackendUri() : "http://" + BACKEND_HOST + ":" + BACKEND_PORT;
const SOCKET_HOST = process.env.VITE_SOCKET_HOST || "127.0.0.1";
export const SOCKET_URL = IS_CLOUD_DEMO ? getCloudSocketUrl() : `ws://${SOCKET_HOST}:${BACKEND_PORT}/ws`;
export const CLOUD_DEMO_TIMEOUT_REDIRECT_URL = process.env.VITE_CLOUD_DEMO_TIMEOUT_REDIRECT_URL || 'https://docs.flojoy.ai/explore-nodes/'
export const REQUEST_NODE_URL = "https://toqo276pj36.typeform.com/to/F5rSHVu1";
