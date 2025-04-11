const express = require("express");
const server = express();

// pegar o banco de dados
const db = require("./database/db");

// configurar pasta publica
server.use(express.static("public"));

// habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }));

// utilizando template engine
const nunjucks = require("nunjucks");
const env = nunjucks.configure("src/views", {
   express: server,
   noCache: true,
});
// Adiciona o filtro `tojson`
env.addFilter("tojson", function (obj) {
   return JSON.stringify(obj);
});

// configurar caminhos da minha aplicação
// página inicial
// req: Requisição
// res: Resposta
server.get("/", (req, res) => {
   return res.render("index.html", { title: "Um título" });
});

server.get("/create-point", (req, res) => {
   return res.render("create-point.html");
});

server.post("/savepoint", (req, res) => {
   const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `;

   const values = [
      req.body.image,
      req.body.name,
      req.body.address,
      req.body.address2,
      req.body.state,
      req.body.city,
      req.body.items,
   ];

   function afterInsertData(err) {
      if (err) {
         return res.send("Erro no cadastro!");
      }

      return res.render("create-point.html", { saved: true });
   }

   db.run(query, values, afterInsertData);
});

server.get("/search", (req, res) => {
   const search = req.query.search;

   if (!search) {
      return res.render("search-results.html", { total: 0 });
   }

   const query = `SELECT * FROM places WHERE city LIKE ?`;
   const searchTerm = `%${search}%`;

   db.all(query, [searchTerm], function (err, rows) {
      if (err) {
         console.error(err);
         return res.render("search-results.html", { total: 0 });
      }

      const total = rows.length;
      return res.render("search-results.html", {
         places: rows,
         total: total,
      });
   });
});

server.get("/favorites", (req, res) => {
   return res.render("favorites.html");
});

server.get("/api/favorites", (req, res) => {
   const ids = req.query.ids;

   if (!ids) return res.json([]);

   // Remove duplicatas dos IDs
   const uniqueIds = [...new Set(ids.split(","))];

   const placeholders = uniqueIds.map(() => "?").join(",");
   const query = `SELECT * FROM places WHERE id IN (${placeholders})`;

   db.all(query, uniqueIds, function (err, rows) {
      if (err) {
         console.error(err);
         return res.json([]);
      }

      return res.json(rows);
   });
});

// ligar o servidor
server.listen(3000);
