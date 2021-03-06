var api = {
    getVideos: function(player, callback) {
        $.ajax(
            "/api/get_videos",
            {
                method: "post",
                dataType: "json",
                success: function(data) {
                    var newVideos = $.map(data, function(v) {
                        var ts = $.map(v.timestamps, function(t) {
                            return new Timestamp(t.time, t.name);
                        });
                        return new Video(v.videoID, v.title, v.star, player, ts);
                    });

                    if (callback) callback(newVideos);
                }
            });
    },

    addVideo: function(videoID, callback) {
        $.ajax(
            "/api/add_video",
            {
                method: "post",
                dataType: "json",
                data: { "videoID": videoID }
            }
        ).done(function(data) {
            if (callback) callback(data);
        });
    },

    deleteVideo: function(videoID) {
        $.ajax(
            "/api/del_video",
            {
                method: "post",
                data: { "videoID": videoID }
            }
        );
    },

    starVideo: function(videoID, star) {
        $.ajax(
            "/api/star_video",
            {
                method: "post",
                data: { "videoID": videoID, star: star }
            }
        )
    },

    getTimestamps: function(videoID, callback) {
        $.ajax(
            "/api/get_timestamps",
            {
                method: "post",
                data: { "videoID": videoID },
                success: function(data) {
                    var newTimestamps = $.map(data, function(i) {
                        return new Timestamp(i.time, i.name);
                    });

                    if (callback) callback(newTimestamps);
                }
            }
        );
    },

    setTimestamps: function(videoID, timestamps) {
        $.ajax(
            "/api/set_timestamps",
            {
                method: "post",
                data: {
                    "videoID": videoID,
                    "timestamps": JSON.stringify(timestamps)
                }
            }
        );
    }
}