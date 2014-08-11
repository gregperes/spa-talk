var restify = require("restify");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/todos");

var Schema = mongoose.Schema;

var TodoSchema = new Schema({
  description     : String,
  completed         : Boolean,
  created_at      : Date
});

mongoose.model("Todo", TodoSchema); 
var Todo = mongoose.model("Todo"); 

var server = restify.createServer({
  name: "todos",
  version: "1.0.0"
});

server.use(restify.CORS({
  origins: ["http://localhost:3000"]
}));

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get("/todos", function (req, res) {

  Todo.find(function(err, todos) {

    if (!err) {

      res.send(200, todos);
    }
    else {

      res.send(500, err);
    }
  });
});

server.get("/todos/:id", function (req, res) {

  Todo.findById(req.params.id, function (err, todo) {

    if (!err) {

      res.send(200, todo);
    }
    else {

      res.send(500, err);
    }
  });
});

server.post("/todos", function (req, res) {

  var todo = new Todo();
  todo.description = req.params.description;
  todo.completed = false;
  todo.created_at = new Date();

  todo.save(function(err) {

    if (!err) {

      res.send(201, todo);
    }
    else {

      res.send(500, err);
    }
  });
});

server.put("/todos/:id", function (req, res) {

  Todo.findById(req.params.id, function(err, todo) {

    if (!err) {

      todo.completed = !todo.completed;
      todo.save();

      res.send(200, todo);
    }
    else {

      res.send(500, err);
    }
  });
});

server.del("/todos/:id", function (req, res) {

  Todo.remove({ _id: req.params.id }, function (err, todo) {

    if (!err) {

      res.send(200);
    }
    else {

      res.send(500, err);
    }
  });
});

server.listen(8000, function () {

  console.log("%s listening at %s", server.name, server.url);
});