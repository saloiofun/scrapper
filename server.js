var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
    extended: false
}));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/webScrapper", {
    useMongoClient: true
});

// Routes

app.get("/scrape", function (req, res) {
    axios.get("https://gizmodo.com/").then(function (response) {
        var $ = cheerio.load(response.data);

        $("h1.headline entry-title js_entry-title").each(function (i, element) {
            var result = {};

            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            db.Article.create(result).then(function (dbArticle) {
                res.send("scrape Complete");
            }).catch(function (err) {
                res.json(err);
            });
        });
    });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({
        _id: req.params.id
    }).populate("note").then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body).then(function (dbNote) {
        return db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {
            note: dbNote._id
        }, {
            new: true
        });
    }).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
})