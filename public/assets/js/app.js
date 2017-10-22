// When you click the saveArticle button
$(document).on("click", "#saveArticle", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/save/" + thisId,
        })
        // With that done
        .done(function (data) {
            // Reload Page
            location.reload();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});