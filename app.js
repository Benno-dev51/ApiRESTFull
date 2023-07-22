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


/////////Request ALL articles////////////////////////////////

app.route("/articles")

.get( (req, res) => {
  Article.find()
    .then(foundArticles => {
      res.json(foundArticles);
    })
    .catch(error => {
      console.error(error);
    });
})
.post(async (req, res) => {
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
})
.delete( async (req, res) => {
  try {
    await Article.deleteMany();

    res.send("Artículos eliminados exitosamente.");
  } catch (error) {
    console.error(error);
    res.send("Error al eliminar los artículos.");
  }
})



///////REQUEST SPECIFIC ARTICLE//////////////
app.route("/articles/:articleTitle")
.get((req,res)=>{
  Article.find({title:req.params.articleTitle})
    .then(foundArticles => {
      if (foundArticles.length === 0) {
        // No se encontró el artículo
        return res.status(404).json({ error: "Artículo no encontrado error 404" });
      }
     res.json(foundArticles)
     console.log(foundArticles)
    })
    .catch(error => {
      console.log(error)
      res.send({ error: "Error al buscar el artículo" });
    });

})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
