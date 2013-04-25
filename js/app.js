window.App = new (Backbone.View.extend({

    start: function() {
        Backbone.history.start({urlRoot: "webplayer"});
    },

    events: {
        "click a": function(e) {
            e.preventDefault();
            console.log("Clicked " + e.currentTarget.pathname);
            Backbone.history.navigate({trigger: true});
        }
    },

    Router: new (Backbone.Router.extend({
       routes: {
           "": "home"
       },

       home: function() {
           var playlist = new Class.Model.PlayList();
           playlist.fetch({
               error: function() {
                   console.log("Error while fetching playlist");
               }
           })
       }
    }))

}))({el: $("body")});