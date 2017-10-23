// When you click the articles-scraper button
$(document).on("click", "#articles-scraper", function () {
    $.ajax({
            method: "GET",
            url: "/scrape/"
        })
        // With that done
        .done(function (data) {
            // Reload Page
            location.reload();
        });
});

// When you click the save-article button
$(".save-article").on("click", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/save/" + thisId
        })
        // With that done
        .done(function (data) {
            // Reload Page
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
                    // With that done
                    .done(function (data) {
                        if (result) {
                            bootbox.alert({
                                message: "Note Saved!",
                                backdrop: true
                            });
                        }
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