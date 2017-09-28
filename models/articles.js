var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  headline: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },

});

var Article = mongoose.model("Article", ArticleSchema)

module.exports = Article