const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

// Display message that server is running...
app.listen(port, () => console.log(`Listening on port ${port}`))

// create a GET route
app.get('/ping', (req, res) => {
  console.log('pinged server...');
  res.send({ serverConnected: true  });
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Receive a flow chart and write file ("wf") to disk
app.post('/wfc', (req, res) => {
  console.log('Flow chart payload:', req.body.fc);

  fs.writeFileSync( 'PYTHON/WATCH/fc.json', req.body.fc );

  res.send({ status: 'Running program...' });
});