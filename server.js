const express = require('express');
const fs = require('fs');
const os = require('os');
const Redis = require("ioredis");
const redis = new Redis(); // uses defaults unless given configuration object  

const app = express();
const port = process.env.PORT || 5000;

// Display message that HTTP server is running...
app.listen(port, () => console.log(`Listening on port ${port}`))

// create a GET route
app.get('/ping', (req, res) => {
  console.log('pinged server...');
  res.send({ cnx: true  });
});

app.get('/heartbeat', async (req, res) => {

  ts = '⏰: ' + os.uptime().toString().slice(-3);

  let heartbeat = {msg: '🐸 server connected', clock: ts, io: {}}

  redis.get('COMPLETED_JOBS').then(function (result) {
    console.log(result);
    if(result !== null){
      result = JSON.parse(result)
      heartbeat.msg = `🏆 Program completed ${result.length} jobs`,
      heartbeat.io = result;
      redis.set('COMPLETED_JOBS', null);
    }
  });

  res.send({heartbeat});
    
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Receive a flow chart, write file ("wf") to disk, & call Python watch script
app.post('/wfc', async (req, res) => {
  console.log('Flow chart payload:', req.body.fc);

  fs.writeFileSync( 'PYTHON/WATCH/fc.json', req.body.fc );

  const spawn = require("child_process").spawn;
  const pythonProcess = spawn('python',['PYTHON/WATCH/watch.py']);

  res.send({ msg: '🏃‍♀️ running program...' });
});