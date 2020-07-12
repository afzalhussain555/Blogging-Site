const express    = require('express');
const mongoose   = require('mongoose'),
methodOverride   = require('method-override'),
expressSanitizer = require('express-sanitizer')
app              = express();

var url = process.env.DATABASEURL || "mongodb://localhost:27017/blog_app"
mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true })

app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//SCHEMA

var BlogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default:Date.now} 
})

var Blog=mongoose.model("Blog",BlogSchema);

//Blog.create({
//    name:"My Shimla visit",
//    image:"https://images.pexels.com/photos/1752417/pexels-photo-1752417.jpeg?auto=compress&cs=tinysrgb&h=350",
//    body:"I was a windy day with clouds all over me, I felt like flying in the clouds. I saw snowfall for the first time in my life I felt so good, I would never forget that day."
//})

app.get('/',function(req,res){
        res.redirect("blogs");
})
app.get("/blogs",function(req,res){
    Blog.find(function(err,blogs){
        if(err)
        console.log(err)
        else
        res.render("index",{blogs:blogs});
    })
})

app.get("/blogs/new", function(req, res){
    res.render("new")
})
//CREATE ROUTER
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog,function(err,newblog){
        if(err)
        res.render("new")
        else
        res.redirect("/blogs");
    })
})
// SHOW PAGE
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id, function(err,blog){
        if(err)
        res.redirect("/blogs")
        else
        res.render("show",{blog:blog})
    })
})

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
        res.redirect("/blogs")
        else
        res.render("edit", {blog:foundBlog})
    })
})
//UPDATE ROUTE
app.put('/blogs/:id',function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err,updatedBlog){
        if(err)
        res.redirect("/blogs")
        else
        res.redirect("/blogs/" +req.params.id)
    })
})
//DELETE ROUTE
app.delete('/blogs/:id',function(req, res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        res.redirect("/blogs")
        else
        res.redirect("/blogs")
    })
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
