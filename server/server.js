#!/usr/bin/nodejs

var express = require('express');
var fs = require('fs');
var sys = require('util')
var exec = require('child_process').exec;
var sleep = require("sleep");
var app = express();
var child = null;

var serverRoot="/home/petru/data/music/petre/";
var player="mplayer";


app.get('/webplayer/rest/list/*', function(req, res) {
    var id = req.params;
    console.log("requesting " + id);
    var json = [];
    fs.readdir(serverRoot + id, function (err, files) {
        if (err) {
//            throw err;
            res.send("Error reading files");
        }
        for (var index in files) {
            json.push(files[index]);
        }
        res.send({"files": json});
    });
});

app.get('/webplayer/rest/play/*', function(req, res) {
    if ( child != null) {
        stopPlayback();
    }

    var id = req.params;
    console.log("playing " + id);
    var cmd = player + " '" + serverRoot + id + "'"
    console.log("-------------------------------------");
    console.log(cmd)
    console.log("-------------------------------------");
    child = exec(cmd, puts);
    res.send("OK");
});

app.get('/webplayer/rest/playAll/*', function(req, res) {
    if ( child != null) {
        stopPlayback();
    }

    var id = req.params;
    // 
    // This works only if the folder does not contain spaces or special characters!
    //
    var cmd = player + " " + serverRoot + id + "/*"
    console.log("-------------------------------------");
    console.log(cmd)
    console.log("-------------------------------------");
    child = exec(cmd, puts);
    res.send("OK");
});

app.get('/webplayer/rest/stop', function(req, res) {
    if (child != null) {
        stopPlayback();
    }
    res.send("OK");
});

var stopPlayback = function() {
    exec("pkill " + player);
    child = null;
    sleep.sleep(1);
}

var puts = function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
}
app.listen(3000);
console.log('Node.js server listening on port 3000...');

