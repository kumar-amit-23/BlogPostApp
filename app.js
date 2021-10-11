//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDatabase", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }else{
      console.log(err);
    }
  });
});

app.post("/edit/:postId", (req, res) => {

  const postId = req.params.postId;

  Post.findOne({ _id: postId }, (err, foundPost) => {
      if (!err) {
          if (!foundPost) {
              console.log("Does not exist");
          } else {
              res.render("edit",
                  {
                      posts: foundPost
                  });
          }
      }
  })
})


app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      posts : post
    });
  });

});


app.post("/update", (req, res) => {

  const postId = req.body.postId;

  const post = {
      title: req.body.postTitle,
      content: req.body.postBody
  }

  Post.updateOne({ _id: postId }, post, (err) => {
      if (!err) {
          res.redirect("/");
      }
  })


})


app.post("/delete", (req, res) => {

  const postId = req.body.postId;

  Post.findByIdAndRemove(postId, (err) => {
      if (!err) {
          res.redirect("/");
      }

  })
})


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
