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

app.get('/',function(req,res){
        res.redirect("blogs");
})
app.get("/blogs",function(req,res){
    res.render("index")
})

app.listen(3000,function(){
    console.log("Server is running now")
});
