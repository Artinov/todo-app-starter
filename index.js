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
    index: Number,
    id: String
});

var User = mongoose.model('Todo', {
    login: String,
    password: String
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
        if (err) {
            res.send("Saving issue: " + err);
        } else {
            res.send(true);
        }
    });
});

app.post('/todo/update', function(req, res) {
    var updatedTodo = req.body;

    Todo.findOne({ id: updatedTodo.id }, function(err, todo) {
        if (err) {
            res.send("No todo found");
            return;
        }

        todo.isDone = updatedTodo.isDone;
        todo.save(function(err) {
            if (err) {
                res.send("Update issue: " + err);
            } else {
                res.send(true);
            }
        })
    })
});

app.post("/todo/find", function(req, res) {
    var searchRequest = req.body;
    Todo.find(searchRequest, function(err, todos) {
        res.send(todos);
    });
});

app.get("/todo", function(req, res) {
    Todo.find({}, function(err, todos) {
        res.send(todos);
    });
});

app.post("/todo/delete", function(req, res) {
    var todo = req.body;
    console.log(todo);

    Todo.remove({ id: todo.id }, function(err) {
        if (err) {
            res.send("Delete error: " + err);
        } else {
            res.send(true);
        }
    });
});

app.listen(3000, function() {
    console.log("I'm running on http://localhost:3000")
});