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

/* code */
$(document).ready(function() {
    // configure AJAX authentication
    setupCsrf();

    ///// configure jquery-modal

    // push z-index up
    $.modal.defaults.zIndex = 10;

    // enable fade-in
    $.modal.defaults.fadeDuration = 70;

    // decrease default opacity (from 0.75)
    $.modal.defaults.opacity = 0.20;

    // overflow with scrollbar if modal is too big
    $.modal.defaults.maxHeight = 0.90;

    // instantiate model global
    model = new SeekViewModel();
})
