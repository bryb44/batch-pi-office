var express = require("express");
const fs = require("fs")
var app = express();app.listen(3000, '0.0.0.0', () => {
 console.log("Server running on port 3000");
});

app.get("/logs", (req, res, next) => {
    try {
        const data = fs.readFileSync('./orderLogs.txt', 'utf8');
        const logs = data.split("\r\n")
        logs.map(log => log +"<br><br>")
        res.send(logs)
      } catch (err) {
        console.error(err);
      }
});
