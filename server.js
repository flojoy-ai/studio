const express = require('express');
const fs = require('fs');
const os = require('os');
const yaml = require('js-yaml');

const Redis = require("ioredis");
const redis = new Redis(); // uses defaults unless given configuration object  

const app = express();
const port = process.env.PORT || 5000;

const STATUS_CODES = yaml.load(fs.readFileSync('./STATUS_CODES.yml', 'utf8'));

let lastSystemStatus = '';

// Display message that HTTP server is running...
app.listen(port, () => console.log(`Listening on port ${port}`))

// create a GET route
app.get('/ping', (req, res) => { res.send({ msg: STATUS_CODES['SERVER_ONLINE'] })});

app.get('/heartbeat', async (req, res) => {
  redis.get('SYSTEM_STATUS').then(sysStatus => {

    let ts = '⏰ server uptime: ' + os.uptime().toString().slice(-3);
    let hb = {msg: '', clock: ts}

    if( sysStatus != lastSystemStatus ){
      console.log('sysStatus', sysStatus);
    }

    lastSystemStatus = sysStatus;

    switch(sysStatus) {
      case null:
        hb.msg = ts;
        break;
      case STATUS_CODES['RQ_RUN_COMPLETE']:  
        hb.msg = STATUS_CODES['RQ_RUN_COMPLETE'];
        redis.set('SYSTEM_STATUS', STATUS_CODES['STANDBY']);
        break;
      default:
        hb.msg = sysStatus.toString().toLowerCase().replace('_', ' ');    
    }
    res.send(hb);
  });
});

app.get('/io', async (req, res) => {
  redis.get('COMPLETED_JOBS').then(r => {

    let ts = '⏰ server uptime: ' + os.uptime().toString().slice(-3);
    let hb = {msg: STATUS_CODES['MISSING_RQ_RESULTS'], clock: ts, io: {}}

    if(typeof r === 'string' && r.trim(' ') !== ''){
        console.log(r.toString().slice(0, 20));
        hb.msg = STATUS_CODES['RQ_RESULTS_RETURNED'];
        hb.io = r;
    }

    return res.send(hb);
  });
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Receive a flow chart, write flow chart ("wfc") to disk, & start Python watch script
app.post('/wfc', async (req, res) => {

  console.log('Flow chart payload... ', req.body.fc.toString().slice(0,200));

  fs.writeFileSync( 'PYTHON/WATCH/fc.json', req.body.fc );

  var exec = require('child_process').exec;

  var child = exec('python3 PYTHON/WATCH/watch.py')

  child.stdout.on('data', function(data) {
      console.log('Python process stdout: ' + data.slice(0,400))
  })
  child.stderr.on('data', function(data) {
      console.log('Python process stderr: ' + data)
  })
  child.on('close', function(code) {
      console.log('closing code: ' + code)
  })

  redis.set('SYSTEM_STATUS', STATUS_CODES['RQ_RUN_IN_PROCESS']);
  res.send({ 'msg': STATUS_CODES['RQ_RUN_IN_PROCESS'] });
});