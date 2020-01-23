
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const fs = require('fs');
var words = null;

var loadWords = function() {
  words =  JSON.parse(fs.readFileSync('words.json'));
}

app.use(express.static("public"));
app.use(bodyParser.json());


app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/push", function(request, response) {
  response.sendFile(__dirname + "/views/push.html");
});

app.get("/api/words", function(request, response) {
  if (!words)
    loadWords();
  
  response.json(words);
});

app.get("/api/words/:id", function(request, response) {
  if (!words)
      loadWords();
  
  let id = request.params.id
  let word = words[id];
  if (word) {
    response.json(word);
  } else
  {
    response.json(404, {msg: `Unable to find word id '${id}'`, id, code:"WORD_NOT_FOUND"})
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});