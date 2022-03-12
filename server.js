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

  redis.get('COMPLETED_JOBS').then(result => {
    let ts = '⏰: ' + os.uptime().toString().slice(-3);
    let hb = {msg: '🐸 server connected', clock: ts, io: {}}

    if(typeof result === 'string' && result.trim(' ') !== ''){
        hb.msg = '🏆 Program completed';
        hb.io = result;
        redis.set('COMPLETED_JOBS', null);
    }
    console.log(hb);
    return res.send(hb);
  });
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Receive a flow chart, write file ("wf") to disk, & call Python watch script
app.post('/wfc', async (req, res) => {

  console.log('Flow chart payload... ', req.body.fc.toString().slice(0,20));

  fs.writeFileSync( 'PYTHON/WATCH/fc.json', req.body.fc );

  var exec = require('child_process').exec;

  var child = exec('python3 PYTHON/WATCH/watch.py')

  child.stdout.on('data', function(data) {
      console.log('stdout: ' + data.slice(0,200))
  })
  child.stderr.on('data', function(data) {
      console.log('stdout: ' + data)
  })
  child.on('close', function(code) {
      console.log('closing code: ' + code)
  })

  res.send({ msg: '🏃‍♀️ running program...' });
});