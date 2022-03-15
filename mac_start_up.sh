#!/bin/bash

echo 'create symlinks...'
ln STATUS_CODES.yml PYTHON/WATCH/
ln STATUS_CODES.yml src

echo 'spinning up redis server...'
ttab -t 'REDIS' redis-server
sleep 2

echo 'starting redis worker...'
ttab -t 'RQ WORKER' rq worker
sleep 2

echo 'starting node server...'
ttab -t 'NODE' node server.js
sleep 2

ttab -t 'REACT' npm start
