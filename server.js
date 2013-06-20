#!/usr/local/bin/node

var express = require('express');
var fs = require('fs');
var spawn = require('child_process').spawn;
var app = express();
var child = null;

var serverRoot="/data/media/music/";
var player="mplayer";

/**
 * Return the html files.
 */
app.use(express.static(".."));

app.get('/webplayer/rest/list/*', function(req, res) {
    var id = req.params,
        json = [],
        dir =  serverRoot + id;

    console.log("requesting " + id);
    //
    // if requested file is directory
    // 
    if (fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()) {
        fs.readdir(serverRoot + id, function (err, files) {
            if (err) {
                res.send("Error reading files");
            }
            for (var index in files) {
                json.push(files[index]);
            }
            res.send({"files": json});
        });
    } else {
        res.send("Requested file is not a directory!");
    }
});

app.get('/webplayer/rest/play/*', function(req, res) {
    //
    // First thing first! Before playing, stop other playing songs.
    //
    stopPlayback();

    var id = req.params,
        file = serverRoot + id;

    console.log("Playing " + file);

    child = spawn(player, ["-slave", file]);
    child.on('close', function (code) {
        if (code !== 0) {
            console.log('Mplayer process exited with code ' + code);
        }
    });
    var response = {"status": "ok"}
    res.send(response);
});

/**
 * Play all files in folder
 * TODO: not yet functional
 */
app.get('/webplayer/rest/playall/*', function(req, res) {
    //
    // First thing first! Before playing, stop other playing songs.
    //
    stopPlayback();

    var id = req.params,
        dir = serverRoot + id;

    console.log("Playing all files in: " + dir);

    if (fs.lstatSync(dir).isDirectory()) {
        child = spawn(player, ["-slave", dir + "*"]);
        child.on('close', function (code) {
            if (code !== 0) {
                console.log('Mplayer process exited with code ' + code);
            }
        });
        
        res.send("Playing");
    } else {
        res.send("The file specified is not a folder!");
    }
});

/**
 * Stop the curent child process (playback).
 */
app.get('/webplayer/rest/stop', function(req, res) {
    stopPlayback();
    res.send("OK");
});

/**
 * Pause the current child process (playback).
 */
app.get('/webplayer/rest/pause', function(req, res) {
    if (child) {
        child.stdin.write("p\n")
    }
    res.send("OK");
});

/**
 * Play next file in the current child process.
 */
app.get('/webplayer/rest/next', function(req, res) {
    if (child) {
        child.stdin.write(">\n")
    }
    res.send("OK");
});

var stopPlayback = function() {
    if (child) {
        child.kill();
        child = null;
    }
}

app.listen(3000);
console.log('Node.js server listening on port 3000...');

