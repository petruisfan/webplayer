var fs = require('fs'),
    spawn = require('child_process').spawn;

var serverRoot="/data/media/music/",
    player="mplayer",
    child = null;


exports.list = function(req, res) {
    var id = req.params,
        dir =  serverRoot + id;

    console.log("requesting " + id);
    var result = ls(dir);
    res.send({"files": result});
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
            return;
        }
        playNext(file);
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
        child.stdin.write("q\n")
        child.kill();
        child = null;
    }
}

var ls = function(dir) {
    //
    // if requested file is a directory
    //
    if (fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()) {
        var files = fs.readdirSync(dir);

        return files;
    } else {
        // TODO return code response;
        return "Requested file is not a directory!";
    }
}

var playNext = function(file) {
    var dir = dirname(file),
        files = ls(dir),
        index = files.indexOf(basename(file)) + 1;

    if (index >= files.length) {
        index = 0;
    }
    var next_file = dir + files[index];
    console.log("Next playing " + next_file);

    child = spawn(player, ["-slave", next_file]);
    child.on('close', function (code) {
        if (code !== 0) {
            console.log('Mplayer process exited with code ' + code);
            return;
        }
        playNext(next_file);
    });
}

var dirname = function(folder) {
    folder = folder.substring(0, folder.length-1);
    var end = folder.lastIndexOf("/");

    return folder.substring(0,end) + "/";
}

var basename = function(file) {
    var end = file.lastIndexOf("/");
    return file.substring(end+1) ;
}