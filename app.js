const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const express = require("express")

const app = express();
app.set('view enginer', 'ejs')
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true});

const articleSchema = {
  title: String,
  content: String
}
const Article = mongoose.model("Article", articleSchema);

//======requests targeting all articles======
app.route("/articles")
  .get(function(req, res){
    Article.find(function(err, results){
      if(err){
        //console.log("ERR");
        res.send(err);
      }else{
        //console.log(results);
        res.send(results);
      }
    });
  })
  .post(function(req, res){
    const newArticle = new Article({
      title: req.body.title,
      content:req.body.content
    });
    newArticle.save(function(err){
      if(err){
        res.send(err);
      }else{
        res.send("Successfully added new article!");
      }
    });
  })
  .delete(function(req, res){
    Article.deleteMany(function(err){
      if(err){
        res.send(err);
      }else{
        res.send("Successfully deleted articles!")
      }
    });
  });

//======requests a specific article======
app.route("/articles/:articleTitle")
  .get(function(req, res){
    Article.findOne(
      {title: req.params.articleTitle},
      function(err, result){
        if(result){
          res.send(result);
        }else{
          res.send("No articles matching that title was found.");
        }
      }
    );
  })

  .put(function(req, res){ //put request replaces entire resource eg missing values are gone
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(err){
          res.send(err);
        }else{
          res.send("Updated article Successfully!");
        }
      }
    );
  })

  .patch(function(req, res){
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body}, //only update fields that have new value...
      function(err){
        if(err){
          res.send(err);
        }else{
          res.send("Updated article Successfully!");
        }
      }
    );
  })

  .delete(function(req, res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(err){
          res.send(err);
        }else{
          res.send("Successfully deleted article!")
        }
      });
  });


app.listen(3000, function() {
  console.log("Server has started Successfully");
});
