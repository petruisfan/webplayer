/**
 * User: petru
 * Date: 6/19/13
 * Time: 10:32 AM
 */

var App = new (Backbone.View.extend({
    currentFolder: "",
    playerItem: null,
    paused: false,


    /**
     * Add "/" in front, remove "/" in end.
     * @param path
     */
    setCurrentFolder: function (path) {
        var n = path.length;

        if (path.substring(n-1) == "/") {
            path = path.substring(0, n-1);
        }
        if ( path && path.substring(0,1) !=  "/" ) {
            path = "/" + path;
        }
        App.currentFolder = path;
    },

    events: {
        "click a" : function(e) {
            e.preventDefault();
            var url = e.currentTarget.pathname

            if (url) {
                Backbone.history.navigate(url, {trigger: true});
            }
        }
    },

    start: function() {
        Backbone.history.start();
    },

    play: function(li) {
        //
        // If we have only the <p> inside, and not the div#player
        //
        if ( $(li).children().length == 2 ) {
            var songName = $(li).text().trim(),
                player = new Class.Model.Player();

            console.log("Playing: " + songName);
            App.paused = false;

            if (App.playerItem) {
                App.playerItem.remove();
            }

            $(li).append($("#playerDiv").html());
            App.playerItem = $("div#player");
            player.url = encodeURI(Util.serverApi + "play" + App.currentFolder + "/" + songName);

            player.fetch({
                error: Util.alert("Unable to play " + player.url)
            });
        }
    },
    pause: function(icon) {
        $.ajax({
            url: "/webplayer/rest/pause",
            success: function() {
                console.log("Paused successfully");
                if (App.paused) {
                    $(icon).removeClass("iconic-play").addClass("iconic-pause");
                } else {
                    $(icon).removeClass("iconic-pause").addClass("iconic-play");
                }
                App.paused = ! App.paused;
            },
            error: function() {
                console.log("Paused failed")
            }
        });
    },
    stop: function() {
        $.ajax({
            url: "/webplayer/rest/stop",
            success: function() {
                console.log("Stopped successfully");
                $("p#icon_pause").removeClass("iconic-pause").addClass("iconic-play");
            },
            error: function() {
                console.log("Stopped failed")
            }
        })
    },

    router: new (Backbone.Router.extend({
        routes: {
            "list/*path": "list",
            "stop": "stop",
            "pause": "pause",
            "": "home"
        },

        home: function() {
            console.log("Home");
            this.list("");
        },

        list: function(path) {
            var url = Util.serverApi + "list/" + path,
                fileList = new Class.Model.FileList();

            App.setCurrentFolder(path);
            console.log("Listing: " + path);

            fileList.url = url;
            fileList.fetch({
                error: function() {
                    console.error("Failed to load " + url);
                }
            })
        }
    }))
}))({el: $("body")})