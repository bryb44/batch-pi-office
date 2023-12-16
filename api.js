var express = require("express");
const fs = require("fs")
var app = express();app.listen(3000, '0.0.0.0', () => {
 console.log("Server running on port 3000");
});

function getHourOfLastLog(logs) {
  return logs[logs.length-2].split("O")[0]
}




app.get("/logs", (req, res, next) => {
    try {
        const data = fs.readFileSync('./orderItemsLogs.txt', 'utf8');
        const logs = data.split("\r\n")
        logs.map(log => log +"<br><br>")
        res.send(htmlStatus(getHourOfLastLog(logs)))
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




const htmlStatus =(log) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Statut du Service - En Ligne</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            color: #333;
        }

        .container {
            text-align: center;
        }

        .status {
            font-size: 2em;
            color: #27ae60; /* Couleur verte pour indiquer que le service est en ligne */
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Statut du Service</h1>
        <p class="status">En Ligne</p>
        <h1>Derniere Commande traitée</h1>
        <p class="status">${log}</p>
    </div>
</body>
</html>

`
