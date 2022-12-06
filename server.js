var express = require('express');
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;
var dataservice = require("./final");
app.use(express.urlencoded({ extended : true }));
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/finalViews/home.html"));
})

app.get("/register", function(req, res) {
    res.sendFile(path.join(__dirname, "/finalViews/register.html"));
})
app.post("/register", function(req, res) {
    dataservice.register(req.body).then(function(user){
        var userEmail = user.email;
        let resText =  `<p>${userEmail} created successfully</p>`;
        res.send(resText); // sorry forgot how to do this stuff with the sending restext variables
    }).catch(function(err){
        res.json(err);
    })
})
app.get("/signIn", function(req, res) {
    res.sendFile(path.join(__dirname, "/finalViews/signIn.html"));
})
app.post("/signIn", function(req, res) {
    dataservice.signIn(req.body).then(function(){
        let resText = "<p>test</p>";
        res.send(resText);
    }).catch(function(err){
        res.json(err);
    })
})
app.use((req, res)=> {
    res.status(404).send("Page not found");
})

dataservice.startDB().then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err) {
    console.log("unable to start server: " +err);
})
