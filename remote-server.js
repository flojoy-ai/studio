/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const AWS = require('aws-sdk');

const app = express();

// Serve static files from the 'dist-electron/studio' directory
app.use(express.static(path.join(__dirname, 'dist-electron', 'studio')));

// Proxy configuration from setupProxy.js
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "127.0.0.1";
const BACKEND_PORT = +process.env.REACT_APP_BACKEND_PORT || 5392;
const target = "http://" + BACKEND_HOST + ":" + BACKEND_PORT;
const port = +process.env.REMOTE_STUDIO_PORT || 8080;
const host = process.env.REMOTE_STUDIO_HOST || '0.0.0.0';

app.use('/wfc', createProxyMiddleware({ target, changeOrigin: true, ws: true, logLevel: "debug" }));
app.use('/cancel_fc', createProxyMiddleware({ target, changeOrigin: true, ws: true, logLevel: "debug" }));
app.use('/io', createProxyMiddleware({ target, changeOrigin: true, ws: true }));
app.use('/ping', createProxyMiddleware({ target, changeOrigin: true, ws: true }));
app.use('/heartbeat', createProxyMiddleware({ target, changeOrigin: true, ws: true }));

// TODO maybe add a method to this file which kills the task if a HTTP method has not been handled in 30 minutes?
// Are there any http requests that are automatically reoccuring and should be ignored for this purpose?
app.post('/kill-demo', async (req, res) => {
  const ecs = new AWS.ECS();
  const elbv2 = new AWS.ELBv2();
  
  const { currentUrl } = req.body;
  
  // Get the load balancer's information
  const { LoadBalancers } = await elbv2.describeLoadBalancers().promise();
  
  // Find the load balancer for the current URL
  const loadBalancer = LoadBalancers.find(lb => lb.DNSName === currentUrl);
  
  if (!loadBalancer) {
    return res.status(404).send('Load balancer not found');
  }
  
  // Get the IP address of the target group
  const { TargetHealthDescriptions } = await elbv2.describeTargetHealth({
    TargetGroupArn: loadBalancer.TargetGroups[0].TargetGroupArn
  }).promise();
  
  const ipAddress = TargetHealthDescriptions[0].Target.Id;
  
  // Get the running tasks
  const { taskArns } = await ecs.listTasks().promise();
  
  for (const taskArn of taskArns) {
    const { tasks } = await ecs.describeTasks({ tasks: [taskArn] }).promise();
    
    // Find the task with the matching IP address
    const task = tasks.find(task => task.containers[0].networkInterfaces[0].privateIpv4Address === ipAddress);
    
    if (task) {
      const params = {
        task: task.taskArn,
        reason: 'Demo timeout'
      };
      
      ecs.stopTask(params, (err, data) => {
        if (err) {
          console.log(err, err.stack);
          res.status(500).send(err);
        } else {
          console.log(data);
          res.status(200).send(data);
        }
      });
      
      break;
    }
  }
});

app.listen(port, host,  () => {
  console.log(`Server listening on http://${host}:${port}`);
});
