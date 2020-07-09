const { urlencoded } = require('express');

const mongoose = require('mongoose'),
express        = require('express'),
app            = express();

mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParser:true, useUnifiedTopology:true })


app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}));

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

app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(err,newblog){
        if(err)
        res.render("new")
        else
        res.redirect("/blogs");
    })
})

app.listen(3000,function(){
    console.log("Server is running now")
});
