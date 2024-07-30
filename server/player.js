
const MAP = require("./map");
const WAITING = 1;
const TURNING_RIGHT = 2;
const TURNING_LEFT = 3;
const MOVING_FORWARD = 4;
let allPlayers = [];

const createNewPlayer = (socketId, width, height) => {
    const startX = Math.floor(Math.random() * width);
    const startY = Math.floor(Math.random() * height);
    const newPlayer = 
    {
        socketId: socketId,
        startX: startX,
        startZ: startY,
        playerDirection: MAP.NORTH,
        playerState: WAITING,
        currentDirection: 0,
        player: {gridX:startX, gridY:startY, direction: MAP.NORTH},
        turningArc: 0,
        walkingDistance: 0,
        last_update: Date.now(),
        playerInput: {right:0,left:0,up:0,down:0}
    };
    allPlayers.push(newPlayer);
    return newPlayer;
};

module.exports.createNewPlayer = createNewPlayer;
module.exports.getAllPlayers = () => allPlayers;
module.exports.removePlayer = socketId => {
    console.log('removing Player ', allPlayers.find(player => player.socketId === socketId));
    allPlayers = allPlayers.filter(player => player.socketId !== socketId);
};