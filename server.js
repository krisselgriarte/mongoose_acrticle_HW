/* Showing Mongoose's "Populated" Method
 * =============================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
// var Note = require("./models/Note.js");
var Article = require("./models/articles.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/News");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// ROUTES
// A GET request to scrape the NY times website
app.get("/style", function(req, res) {
  // First, we grab the body of the html with request
  request("https://www.nytimes.com/section/fashion", function(error, response, html) {
  // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("div.story-meta").each(function(i, element) {
  // Save an empty result object
      var result = {};

  // Add the text and href of every link, and save them as properties of the result object
     result.headline = $(element).find("h2.headline").text();
     result.summary = $(element).find("p.summary").text();
     result.author = $(element).find("p.byline").text();
    	
     var entry = new Article(result);

     entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });

  });

   Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });


});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});