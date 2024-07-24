const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const createMazeGridPims = require("./map");
const createCollectibles = require("./collectables");
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

const serverMap = createMazeGridPims(20, 20);
const collectables = createCollectibles(5, 20, 20);

io.on('connection', (socket) => {
  console.log('client connected: ',socket.id);
  io.to(socket.id).emit('mapFromServer', { map: serverMap, collectables: collectables });
  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
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

