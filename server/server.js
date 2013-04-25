#!/usr/bin/nodejs

var express = require('express');
var fs = require('fs');
var sys = require('util')
var exec = require('child_process').exec;

var app = express();
var serverRoot="/home/petru/data/music/petre/";
var child = null;

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
    if (child == null) {
        var id = req.params;
        console.log("playing " + id);
        function puts(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
              console.log('exec error: ' + error);
            }
        }
        var cmd = "omxplayer '" + serverRoot + id + "'"
        child = exec(cmd, puts);
        console.log(cmd);

        child.on("SIGTERM", function() {
           console.log("Parent SIGTERM detected");
           // exit cleanly
           child.exit();
        });

        res.send("OK");
    } else {
        console.log("Already playing");
    }
});

app.get('/webplayer/rest/stop', function(req, res) {
    if (child != null) {
//        console.log(child.kill('SIGINT'));
        exec("pkill omxplayer");
        child = null;
    }
    res.send("OK");
});

app.listen(3000);
console.log('Node.js server listening on port 3000...');

