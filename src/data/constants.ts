export const BACKEND_DEFAULT_PORT = 8000;
export const NODES_REPO = "https://github.com/flojoy-io/nodes/blob/main";
const BACKEND_HOST = process.env.VITE_SOCKET_HOST || "127.0.0.1";
const BACKEND_PORT = process.env.VITE_BACKEND_PORT
  ? +process.env.VITE_BACKEND_PORT
  : 8000;
export const API_URI = "http://" + BACKEND_HOST + ":" + BACKEND_PORT;
const SOCKET_HOST = process.env.VITE_SOCKET_HOST || "127.0.0.1";
export const SOCKET_URL = `ws://${SOCKET_HOST}:${BACKEND_PORT}/ws`
export const REQUEST_NODE_URL = "https://toqo276pj36.typeform.com/to/F5rSHVu1"