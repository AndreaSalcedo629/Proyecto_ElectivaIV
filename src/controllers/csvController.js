const csv = require("csv-parser");
const fs = require("fs");
const $rdf = require("rdflib");
const CSVModel = require("../models/csvModel");

exports.uploadCSV = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No se ha proporcionado un archivo CSV");
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      fs.unlinkSync(req.file.path);

      const cleanedData = results.map((row) => ({
        title: row.Título,
        description: row.Descripción,
        reach: row.PersonasAlcanzadas,
        interactions: row.Interacciones,
        shares: row.VecesCompartido,
        likes: row.Likes,
        comments: row.Comentarios,
      }));

      const newEntry = new CSVModel({ data: cleanedData });
      newEntry
        .save()
        .then(() => console.log("Datos guardados correctamente"))
        .catch((err) => console.error(`Error al guardar los datos: ${err}`));

      const store = $rdf.graph();
      const ns = "http://example.com/ontology#";
      const base = $rdf.sym(ns);
      const titleProp = $rdf.sym(ns + "title");
      const descriptionProp = $rdf.sym(ns + "description");
      const reachProp = $rdf.sym(ns + "reach");
      const interactionsProp = $rdf.sym(ns + "interactions");
      const sharesProp = $rdf.sym(ns + "shares");
      const likesProp = $rdf.sym(ns + "likes");
      const commentsProp = $rdf.sym(ns + "comments");
      const facebookPostClass = $rdf.sym(ns + "FacebookPost");
      const rdfTypeProp = $rdf.sym(
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
      );

      cleanedData.forEach((post, index) => {
        const postId = `http://example.com/post${index + 1}`;
        const postNode = $rdf.sym(postId);
        store.add(postNode, titleProp, $rdf.lit(post.titulo));
        store.add(postNode, descriptionProp, $rdf.lit(post.descripcion));
        store.add(postNode, reachProp, $rdf.lit(post.alcance));
        store.add(postNode, interactionsProp, $rdf.lit(post.interacciones));
        store.add(postNode, sharesProp, $rdf.lit(post.compartidos));
        store.add(postNode, likesProp, $rdf.lit(post.likes));
        store.add(postNode, commentsProp, $rdf.lit(post.comentarios));
        store.add(postNode, rdfTypeProp, facebookPostClass);
      });

      console.log(store.toString());
      res.json({ status: "success", dataClean: cleanedData, ontology: store });
    });
};

exports.getLastEntry = (req, res) => {
  CSVModel.findOne({}, {}, { sort: { _id: -1 } })
    .then((lastEntry) => {
      if (!lastEntry) {
        return res.status(404).json({ error: "No hay entradas en la colección" });
      }
      res.json(lastEntry);
    })
    .catch((err) => {
      console.error(`Error al obtener la última entrada: ${err}`);
      res.status(500).json({ error: "Error al obtener la última entrada" });
    });
};