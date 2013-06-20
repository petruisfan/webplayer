/**
 * User: petru
 * Date: 6/19/13
 * Time: 12:34 PM
 */
window.Util = {
    serverRoot: "/webplayer/",
    serverApi: "/webplayer/rest/",

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

    dirname: function(folder) {
        folder = folder.substring(0, folder.length-1);
        var end = folder.lastIndexOf("/");

        return folder.substring(0,end) + "/";
    },

    basename: function(file) {
        var end = file.lastIndexOf("/");
        return file.substring(end) ;
    },

    alert: function(message) {
        console.error(message);
    }
}
