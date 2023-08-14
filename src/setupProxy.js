const { createProxyMiddleware } = require("http-proxy-middleware");

const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "127.0.0.1";
const BACKEND_PORT = +process.env.REACT_APP_BACKEND_PORT || 8000;
const target = "http://" + BACKEND_HOST + ":" + BACKEND_PORT;

module.exports = function (app) {
  app.use(
    "/wfc",
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      logLevel: "debug",
    }),
  );
  app.use(
    "/cancel_fc",
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      logLevel: "debug",
    }),
  );

  app.use(
    "/io",
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
    }),
  );

  app.use(
    "/ping",
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
    }),
  );

  app.use(
    "/heartbeat",
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
    }),
  );
};
