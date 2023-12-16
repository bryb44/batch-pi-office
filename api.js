var express = require("express");
const fs = require("fs")
var app = express();app.listen(3000, '0.0.0.0', () => {
 console.log("Server running on port 3000");
});

app.get("/logs", (req, res, next) => {
    try {
        const data = fs.readFileSync('./orderItemsLogs.txt', 'utf8');
        const logs = data.split("\r\n")
        logs.map(log => log +"<br><br>")
        res.send(logs)
      } catch (err) {
        console.error(err);
      }
});

app.get("/liste", (req, res, next) => {
	res.send(`
		<h1>Coucou les Djeuns</h1>
		<a href='https://docs.google.com/document/d/1TvjGDP2nn1exVmM2l6ix3QNvCHZivf2feLvGm50i9fc/edit?usp=sharing'>Voici ma liste de noel</a>
	`)
});
