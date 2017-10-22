$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        {
            var card = $('<div class="card w-100 mb-3">');
            var cardTitleLink = $('<a href=' + data[i].link + '>');
            var cardTitle = $('<h4 class="card-header">');
            cardTitleLink.text(data[i].title);
            cardTitle.append(cardTitleLink);

            var cardBody = $('<div class="card-body">');
            var cardText = $('<p class="card-text">');
            cardText.text(data[i].summary);
            cardBody.append(cardText);

            var cardLink = $('<a href=' + data[i].link + ' class="btn btn-primary">View Article</a>');
            cardBody.append(cardLink);

            card.append(cardTitle);
            card.append(cardBody);

            $('.articles').append(card);
        }
    }
});