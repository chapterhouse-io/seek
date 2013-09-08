/* knockout models */

function Video(videoID) {
    var self = this;

    self.videoID = videoID;

    self.timestamps = ko.observableArray();

    self.getThumbnailUrl = function() {
        return "http://img.youtube.com/vi/" + self.videoID + "/default.jpg";
    }

    self.loadVideo = function() {
        model.currentVideo(self);
        $("#player").tubeplayer("cue", videoID);
        //$("#player").tubeplayer("play");
    }

    self.addTimestamp = function(name) {
        var playerData = $("#player").tubeplayer("data");

        self.timestamps.push(new Timestamp(playerData.currentTime, name));
    }
}

function Timestamp(time, name) {
    var self = this;
    self.time = time;
    self.name = name;

    self.getDisplay = function() {
        // pad a zero if necessary
        var seconds = ("0" + Math.floor(self.time % 60));
        seconds = seconds.substr(seconds.length - 2);
        return Math.floor(self.time / 60) + ":" + seconds;
    }

    self.deleteTimestamp = function() {
        model.currentVideo().timestamps.remove(self);
    }

    self.seekTimestamp = function(a, b) {
        $("#player").tubeplayer("seek", self.time);
    }
}

function VideosViewModel() {
    var self = this;

    self.videos = ko.observableArray();

    self.currentVideo = ko.observable();

    /* event handlers */
    self.onLoginClick = function() {
        $("#loginModal").modal();
    }

    self.onAddVideoClick = function() {
        $("#addVideoModal").modal();
    }

    self.onAddVideoSubmit = function(model, e) {
        if (e.charCode === 13) {
            var videoID = $("#videoID").val();
            var video = new Video(videoID);

            self.videos.unshift(video);
            video.loadVideo();

            api.addVideo(videoID);

            $.modal.close();

            $("#videoID").val("");

            return;
        }
        return true;
    }

    self.onAddTimestamp = function() {
        self.currentVideo().addTimestamp(prompt("Name"));
    }

    self.onDeleteVideoClick = function() {
        var i = self.videos.indexOf(self.currentVideo());

        api.deleteVideo(self.currentVideo().videoID);
        self.videos.remove(self.currentVideo());

        if (self.videos().length == 0) {
            self.currentVideo(null);
            return;
        } else if (i > 0) {
            i -= 1;
        }
        self.videos()[i].loadVideo();
    }
}

/* private methods */

// configure ajax requests to pass csrf cookie
function setupCsrf() {
    var csrftoken = $.cookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        crossDomain: false,
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }}});
}

// set up the youtube player
function setupTubePlayer(videoID) {
    if (!videoID) {
        videoID = 'FGVGFfj7POA';
    }

    $("#player").tubeplayer({
        width: 600,
        height: 450,
        allowFullScreen: "true",
        initialVideo: videoID
    });
}

/* code */

// configure AJAX authentication
setupCsrf();

// instantiate model
var model = new VideosViewModel();

// load our videos, and when complete load our player
api.getVideos(function(videos) {
    if (videos.length != 0) {
        model.videos(videos);
        setupTubePlayer(videos[0].videoID);
        videos[0].loadVideo();
    } else {
        setupTubePlayer();
    }

    ko.applyBindings(model);
});
