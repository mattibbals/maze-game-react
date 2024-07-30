const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const MAP = require("./map");
const createCollectibles = require("./collectables");
const PLAYER = require("./player");
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server,{ 
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["my-custom-header"]
    }
}) //in case server and client run on different urls

const path = require("path");


app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

const MAPWIDTH = 20;
const MAPHEIGHT = 20;
const NUMCOLLECTIBLES = 5;

const map = MAP.createMazeGridPims(MAPWIDTH, MAPHEIGHT);
const collectables = createCollectibles(NUMCOLLECTIBLES, MAPWIDTH, MAPHEIGHT);

io.on('connection', (socket) => {
  console.log('client connected: ',socket.id);
  const player = PLAYER.createNewPlayer(socket.id, MAPWIDTH, MAPHEIGHT);
  const players = PLAYER.getAllPlayers();
  console.log('All Players = ', players);
  const retVal = {
    map,
    collectables,
    players
  };
//  console.log('retVal = ', retVal);
  io.to(socket.id).emit('mapFromServer', retVal);
  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    PLAYER.removePlayer(socket.id);
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
})

// start express server on port 5000
server.listen(PORT, () => {
  console.log("server started on port " + PORT);
});

