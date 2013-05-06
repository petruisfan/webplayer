window.Util = {
    serverRoot: "/webplayer/",

    addServerRoot: function(path) {
        return this.serverRoot + path;
    },

    removeServerRoot: function(url) {
        return url.substring(this.serverRoot.length);
    },
    isMp3: function(file) {
        var suffix = ".mp3";
        return file.indexOf(suffix, file.length - suffix.length) !== -1;
    },
    getParentFolder: function(folder) {
        folder = folder.substring(0, folder.length-1);
        var end = folder.lastIndexOf("/");

        return folder.substring(0,end) + "/";
    }

}