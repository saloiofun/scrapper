var express = require("express");
var bodyParser = require("body-parser");
const exphbs = require('express-handlebars');
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

app.engine("hbs", exphbs({
    defaultLayout: "main",
    extname: '.hbs'
}));
app.set("view engine", "hbs");

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
    extended: false
}));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webScrapper";
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
});

// Routes

app.get("/scrape", function (req, res) {
    axios.get("https://gizmodo.com/").then(function (response) {
        var $ = cheerio.load(response.data);

        mongoose.connection.db.listCollections({
            name: 'articles'
        }).next(function (err, collinfo) {
            if (collinfo) {
                $("article").each(function (i, element) {
                    var result = {};
                    result.title = $(this).children("header").children("h1").children("a").text();
                    result.link = $(this).children("header").children("h1").children("a").attr("href");
                    result.date = $(this).children("header").children("div .meta--pe").children("div .meta__container").children("time").attr("datetime");
                    result.summary = $(this).children("div .item__content").children("div .entry-summary").children("p").text();

                    db.Article.update(result, result, {
                        upsert: true,
                        runValidators: true
                    }).then(function (dbArticle) {
                        //res.send("scrape Complete");
                    }).catch(function (err) {
                        res.json(err);
                    });
                });

            } else {
                $("article").each(function (i, element) {
                    var result = {};
                    result.title = $(this).children("header").children("h1").children("a").text();
                    result.link = $(this).children("header").children("h1").children("a").attr("href");
                    result.date = $(this).children("header").children("div .meta--pe").children("div .meta__container").children("time").attr("datetime");
                    result.summary = $(this).children("div .item__content").children("div .entry-summary").children("p").text();

                    db.Article.create(result).then(function (dbArticle) {
                        //res.send("scrape Complete");
                    }).catch(function (err) {
                        res.json(err);
                    });
                });

            }
        });
    });
});

// Route for getting all Articles from the db
app.get("/", function (req, res) {
    db.Article.find({}).sort({
        "date": -1
    }).then(function (dbArticle) {
        res.render("index", {
            articles: dbArticle
        });
    }).catch(function (err) {
        res.json(err);
    });
});

// Route for getting all Saved Articles from the db
app.get("/saved", function (req, res) {
    db.Article.find({
        saveArticle: {
            $exists: true
        }
    }).then(function (dbArticle) {
        res.render("saved", {
            savedArticles: dbArticle
        });
    }).catch(function (err) {
        res.json(err);
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

app.post("/save/:id", function (req, res) {
    db.SaveArticle.create(req.body).then(function (dbSave) {
        return db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {
            saveArticle: dbSave._id
        }, {
            new: true
        });
    }).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

// Route for grabbing a note
app.get("/saved/note/:id", function (req, res) {
    db.Article.findOne({
        _id: req.params.id
    }).populate("note").then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

app.post("/note/:id", function (req, res) {
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