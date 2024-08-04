const express = require("express");
const server = require("http").createServer();
const PORT = 3000;

const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(PORT, () => console.log(`Server listening at port ${PORT}`));

// Ensuring to close WebSocket and db connection
process.on("SIGINT", () => {
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    shutDownDB();
  });
});

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

  // Add logs to the database
  db.run(`
          INSERT INTO visitors(count, time)
          VALUES(${clientCount}, datetime('now'))
  `);

  ws.on("close", () => {
    console.log(`A client has disconnected :(`);
  });
});

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

// Database configuration
const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(
    `
      CREATE TABLE visitors(
        count INTEGER,
        time TEXT
      )
    `,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      }
    }
  );
});

const getVisitorCount = () => {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  });
};

const shutDownDB = () => {
  getVisitorCount();
  console.log("Shutting down database...");
  db.close();
};
