#!/usr/local/bin/node

var express = require('express'),
    player = require('./routes/player');

var app = express();
/**
 * Return the html files.
 */
app.use(express.static("client"));
//
// Routes!
//
app.get('/webplayer/rest/list/*', player.list);
app.get('/webplayer/rest/play/*', player.play);
app.get('/webplayer/rest/stop', player.stop);
app.get('/webplayer/rest/pause', player.pause);
app.get('/webplayer/rest/next', player.next);
//
// Start server.
//
app.listen(3000);
console.log('Node.js server listening on port 3000...');

