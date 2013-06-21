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
                this.$el.append(this.template(this.model.toJSON()));
                this.startProgressBar();
            },
            startProgressBar: function() {
                try {
                    var length = this.model.get("length").split(":");
                    var seconds = length[0] * 60 + parseInt(length[1]);
                    App.progressbar = new Class.View.ProgressBar(seconds);
                    App.progressbar.start();
                } catch ( e ){
                    Util.alert("Error trying to start progressbar.")
                }
            }
        }),
        ProgressBar: function(seconds) {
            var unit = 100 / seconds,
                progress = 0,
                timer = null,
                progressbar = $("div#progressbar");

            this.start = function() {
                timer = setInterval(this.updateProgress, 1000);
            };

            this.stop = function() {
                clearInterval(timer);
                progressbar.css("width", 0);
            };

            this.pause = function() {
                if ( App.paused) {
                    timer = setInterval(this.updateProgress, 1000);
                } else {
                    clearInterval(timer);
                }
            };

            this.updateProgress = function() {
                progress += unit;
                progressbar.css("width", progress + "%");
                if (progress >= 100) {
                    clearInterval(timer);
                }
                console.log(progress);
            };
        }

    }
}