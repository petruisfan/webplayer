window.App = new (Backbone.View.extend({

    start: function() {
        Backbone.history.start({urlRoot: Util.serverRoot});
    },

    events: {
        "click a": function(e) {
            e.preventDefault();
            var url = Util.removeServerRoot(e.currentTarget.pathname);
            console.log(url);
            Backbone.history.navigate(url, {trigger: true});
        }
    },

    Router: new (Backbone.Router.extend({
       routes: {
           "": "home",
           "rest/list/*path": "loadFolder",
           "rest/play/*path": "playFile"
       },

       home: function() {
           this.loadFolder("");
       },
       loadFolder: function(path) {
           if ( path) {
               path = "/" + path;
           }
           var playlist = new Class.Model.PlayList({folder: path});
           playlist.url = Util.addServerRoot("rest/list/" + path);

           console.log(playlist.url);

           playlist.fetch({
               error: function() {
                   console.log("Error while fetching playlist");
               }
           })
        },
        playFile: function(path) {
            console.log("Playing " + path);
            $.ajax({
                url: "rest/play/" + path,
                success: function(result) {
                    console.log(result);
                },
                error: function() {
                    console.log("Ajax play request failed.");
                }
            });
        }
    })),

    stopPlayback: function() {
        console.log("Stopping Playback");
        $.ajax({
            url: "rest/stop",
            success: function(result) {
                console.log(result);
            },
            error: function() {
                console.log("Ajax play request failed.");
            }
        });
    },

    playAll : function() {
        $.ajax({
            url: "rest/playAll" + App.currentFolder,
            success: function(result) {
                console.log(result);
            },
            error: function() {
                console.log("Ajax play request failed.");
            }
        });
    }

}))({el: $("body")});