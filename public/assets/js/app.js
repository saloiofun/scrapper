// When you click the articles-scraper button
$(document).on("click", "#articles-scraper", function () {
    $.ajax({
            method: "GET",
            url: "/scrape/"
        })
        .done(function (data) {
            location.reload();
        });
});

// When you click the save-article button
$(".save-article").on("click", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
            method: "POST",
            url: "/save/" + thisId
        })
        .done(function (data) {
            bootbox.alert({
                message: "Article Saved!",
                backdrop: true
            });
        });
});

// When you click the note-article button
$(".note-article").on("click", function () {
    var thisId = $(this).attr("data-id");

    bootbox.prompt({
        title: "Add note",
        inputType: 'textarea',
        closeButton: false,
        backdrop: true,
        callback: function (result) {
            if (result) {
                $.ajax({
                        method: "POST",
                        url: "/note/" + thisId,
                        data: {
                            body: result
                        }
                    })
                    .done(function (data) {
                        location.reload();
                    });
            }
        }
    });
});

// When you click the view-note button
$(".view-note").on("click", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/saved/note/" + thisId
    }).done(function (data) {
        bootbox.alert({
            title: "Saved Note",
            message: data.note.body,
            closeButton: false,
            backdrop: true,
        });
    });
});

switch (window.location.pathname) {

    case '/saved':
    case '/saved/':
        $('#view-saved').addClass('active');
        break;
    case '/':
        $('#view-articles').addClass('active');
        break;
}