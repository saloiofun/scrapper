var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SaveSchema = new Schema({
    any: {}
});

var SaveArticle = mongoose.model("SaveArticle", SaveSchema);

module.exports = SaveArticle;