var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mongoose = require('mongoose');

var app = express();


mongoose.connect('mongodb://localhost/todos', function(err) {
    if (err) {
        console.log("Connection issue: " + err)
    }
});

var Todo = mongoose.model('Todo', {
    text: String,
    isDone: Boolean,
    index: Number
});


// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json 
app.use(bodyParser.json())

app.use("/", express.static(path.join(__dirname, "public")));

app.post("/todo/add", function(req, res) {
    console.log(req.body);
    var newTodo = new Todo(req.body);

    newTodo.save(function(err) {
        if (!err) {
            res.send("Saving issue: " + err);
        } else {
            res.send(true);
        }
    });
});

app.listen(3000, function() {
    console.log("I'm running on http://localhost:3000")
});