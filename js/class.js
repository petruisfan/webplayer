window.Class = {
    Model: {
        PlayList: Backbone.Model.extend({
            url: "rest/list/",

            initialize: function() {
                this.on("change", function(model) {
                    console.log("PlayList loaded");
                    new Class.View.PlayList({
                        model: model,
                        el: $("ul.thumbnails")
                    })
                })
            }
        })
    },
    View: {
        PlayList: Backbone.View.extend({
            initialize: function() {
                this.template = _.template($("#thumb").html());
                this.render();
            },
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
            }
        })
    }
}