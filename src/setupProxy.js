const { createProxyMiddleware } = require('http-proxy-middleware');

const BACKEND_HOST = process.env.BACKEND_HOST || 'localhost';
const BACKEND_PORT = process.env.BACKEND_PORT || 8000;
const target = "http://" + BACKEND_HOST + ":" + BACKEND_PORT;


module.exports = function(app) {
  app.use(
    '/wfc',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
  })
    );

  app.use(
    '/wfc',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
  })
    );

  app.use(
    '/io',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
  })
    );

  app.use(
    '/ping',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
  })
    );

  app.use(
    '/heartbeat',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
  })
    );
};