var fs = require('fs'),
    spawn = require('child_process').spawn;

var serverRoot="/data/media/music/",
    player="mplayer",
    child = null;


exports.list = function(req, res) {
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
};

exports.play = function(req, res) {
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

    var p = spawn("mp3info", ["-p", "%m:%s", file]);
    p.stdout.on('data', function (data) {
        var response = {
            "status": "ok",
            "length": data.toString()
        };
        res.send(response);
    });
};

exports.stop = function(req, res) {
    stopPlayback();
    res.send("OK");
};

exports.pause = function(req, res) {
    if (child) {
        child.stdin.write("p\n")
    }
    res.send("OK");
}

exports.next = function(req, res) {
    if (child) {
        child.stdin.write(">\n")
    }
    res.send("OK");
}

var stopPlayback = function() {
    if (child) {
        child.kill();
        child = null;
    }
}
