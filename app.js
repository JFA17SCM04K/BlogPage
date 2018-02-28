var express=require("express");
var app=express();
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");

// mongoose.connect("mongodb://localhost/restfulblogapp");
mongoose.connect("mongodb://Joeldeep:password@ds251217.mlab.com:51217/restfullblogspageapp");
app.use(express.static(__dirname + '/public'));
var blogSchema=new mongoose.Schema({

    title:String,
    image:String,
    body:String,
    created:{type:Date, default:Date.now}
},{ usePushEach: true });

var Blog=mongoose.model("Blog",blogSchema);

/*Blog.create({

    title: "Test Blog",
    image:"https://s3.amazonaws.com/imagescloud/images/medias/camping/camping-tente.jpg",
    body:"This is blog post"
})*/

app.set("view engine","ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));



//RESTful ROUTES

app.get("/", function(req,res){

    res.redirect("/blogs");
});

//INDEX
app.get("/blogs", function(req,res){
    Blog.find({}, function(err, allBlogs){

        if(err){
            console.log(err);
        }else{
            res.render("index",{Blogs:allBlogs});
        }
    });

});

//NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req,res){

    console.log(req.body.blog);
    req.body.blog.body=req.sanitize( req.body.blog.body);
    console.log(req.body.blog);
    Blog.create(req.body.blog, function(err, addedBlogs){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req,res){

   Blog.findById(req.params.id, function(err,foundBlog){
       if(err){
           console.log(err);
       }else{
           res.render("show",{blog:foundBlog});
       }
   });

});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlogs){

        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit", {blogs:updatedBlogs});
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req,res){

    req.body.blogs.body=req.sanitize( req.body.blogs.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blogs, function(err, updatedBlogs){

        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){

    Blog.findByIdAndRemove(req.params.id, function(err){

        if(err){
        res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
});


app.listen(process.env.PORT||3000, process.env.IP, function(){
    console.log("server is running");
});
