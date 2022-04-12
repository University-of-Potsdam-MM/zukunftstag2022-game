import { createServer } from "http";
import { readFile } from "fs";

createServer(function (req, res) {
  if (req.url === "/") {
    readFile("game/zukunftstag.html", function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.writeHead(200, {
          "Content-Type": "text/html",
        });
        res.write(data);
        res.end();
      }
    });
  } else if (req.url === "/pixi.js") {
    readFile("./pixi.js", function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.writeHead(200, {
          "Content-Type": "application/javascript",
        });
        res.write(data);
        res.end();
      }
    });
  } else {
    console.log(req.url);
    readFile("game" + req.url, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.writeHead(200, {
          "Content-Type": "application/javascript",
        });
        res.write(data);
        res.end();
      }
    });
  }
}).listen(8080);
