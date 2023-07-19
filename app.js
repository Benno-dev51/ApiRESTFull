const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json()); // Agrega esta línea para admitir JSON en el cuerpo de la solicitud

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", (req, res) => {
  Article.find()
    .then(foundArticles => {
      res.json(foundArticles);
    })
    .catch(error => {
      console.error(error);
    });
});

app.post("/article", async (req, res) => {
  try {
    const newTopic = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    await newTopic.save();
    console.log(newTopic);

    res.send("Artículo guardado exitosamente.");
  } catch (error) {
    console.error(error);
    res.send("Error al guardar el artículo.");
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
