const express = require("express");
const server = require("http").createServer();
const PORT = 3000;

const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(PORT, () => console.log(`Server listening at port ${PORT}`));

// Websocket configuration
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ server: server });

wss.on("connection", (ws) => {
  const clientCount = wss.clients.size;
  console.log(`Clients count: ${clientCount}`);

  wss.broadcast(`Current clients count: ${clientCount}`);

  if (ws.readyState == ws.OPEN) {
    ws.send("Welcome to my server");
  }

  ws.on("close", () => {
    console.log(`A client has disconnected :(`);
  });
});

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};
