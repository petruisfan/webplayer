/**
 * User: petru
 * Date: 6/19/13
 * Time: 10:32 AM
 */

var App = new (Backbone.View.extend({
    currentFolder: "",  // current folder in the list view
    playerItem: null,   // Jquery player item element
    paused: false,      // marks if the song is paused or not
    timer: null,        // used for progressbar update


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
        // If we have only the <p>'s inside, and not the div#player
        //
        if ( $(li).children().length == 2 ) {
            var songName = $(li).text().trim(),
                player = new Class.Model.Player();

            console.log("Playing: " + songName);
            App.paused = false;
            clearInterval(App.timer);

            if (App.playerItem) {
                App.playerItem.remove();
            }

            $(li).append($("#playerDivTemplate").html());
            App.playerItem = $("div#player");
            player.url = encodeURI(Util.serverApi + "play" + App.currentFolder + "/" + songName);

            player.fetch({
                timeout: 50000,
                error: Util.alert("Unable to play " + player.url)
            });
        }
    },
    pause: function(icon) {
        $.ajax({
            url: Util.pauseUrl,
            success: function() {
                if (App.paused) {
                    $(icon).removeClass("iconic-play").addClass("iconic-pause");
                } else {
                    $(icon).removeClass("iconic-pause").addClass("iconic-play");
                }
                App.paused = ! App.paused;
            },
            error: function() {
                Util.alert("Paused failed")
            }
        });
    },
    stop: function() {
        $.ajax({
            url: Util.stopUrl,
            success: function() {
                $("p#icon_pause").removeClass("iconic-pause").addClass("iconic-play");
                clearInterval(App.timer);
            },
            error: function() {
                Util.alert("Stopped failed")
            }
        })
    },

    router: new (Backbone.Router.extend({
        routes: {
            "list/*path": "list",
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