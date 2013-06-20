/**
 * User: petru
 * Date: 6/19/13
 * Time: 12:24 PM
 */
window.Class = {
    Model: {
        FileList: Backbone.Model.extend({
            initialize: function() {
                this.on("change", function() {
                    var element = $("div#fileList");
                    new Class.View.FileList({model: this, el: element});
                })
            }
        }),
        Player: Backbone.Model.extend({
            initialize: function() {
                this.on("change", function() {
                    new Class.View.Player({model: this, el: App.playerItem});
                })
            }
        })
    },
    View: {
        FileList: Backbone.View.extend({
            initialize: function() {
                this.template = _.template($("#fileListTemplate").html());
                this.render();
            },
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
            }
        }),
        Player: Backbone.View.extend({
            initialize: function() {
                this.template = _.template($("#playerTemplate").html())
                this.render();
            },
            render: function() {
                this.$el.append(this.template());
            }
        })
    }
}