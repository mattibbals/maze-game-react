const NORTH = 100;
const EAST = 101;
const WEST = 102;
const SOUTH = 103;

const createMazeGridPims = (width, height) => {
    //  console.log("calling createMazeGridPims");
      function MazeCell(northWall, eastWall, southWall, westWall) {
         this.northWall = northWall;
         this.eastWall = eastWall;
         this.southWall = southWall;
         this.westWall = westWall;
       }
       function checkWall(wallListIdx) {
    //      console.log("mazeGrid = ", mazeGrid);
         let cellToCheck = {};
   //      console.log("wallList[" + wallListIdx + "] = ", wallList[wallListIdx]);
         switch(wallList[wallListIdx]['dir']) {
            case NORTH :
               cellToCheck = {x: wallList[wallListIdx].x, z:wallList[wallListIdx].z+1};
               break;
            case SOUTH : 
               cellToCheck = {x: wallList[wallListIdx].x, z:wallList[wallListIdx].z-1};
               break;
            case EAST :
               cellToCheck = {x: wallList[wallListIdx].x+1, z:wallList[wallListIdx].z};
               break;
            case WEST :
            default :
               cellToCheck = {x: wallList[wallListIdx].x-1, z:wallList[wallListIdx].z};
               break;
         }
    //     console.log("cell to check = ", cellToCheck);
         if (((cellToCheck.x < 0)||(cellToCheck.x >= width))||((cellToCheck.z < 0)||(cellToCheck.z >= height))) {
     //       console.log("OUT OF BOUNDS");
            wallList.splice(wallListIdx, 1);
            return;
         }
         if (visitedCells.some((cell) => ((cell.x === cellToCheck.x) && (cell.z === cellToCheck.z)))) {
      //      console.log("VISITED ALREADY");
            wallList.splice(wallListIdx, 1);
            return;
         } else {
            if (wallList[wallListIdx].dir === EAST) 
            {
               wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: SOUTH});
               wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: EAST});
               wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: WEST});
               mazeGrid[cellToCheck.x][cellToCheck.z].northWall = false;
               mazeGrid[wallList[wallListIdx].x][wallList[wallListIdx].z].southWall = false;
            }
            if (wallList[wallListIdx].dir === WEST) {
               wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: NORTH});
               wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: EAST});
               wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: WEST});
               mazeGrid[cellToCheck.x][cellToCheck.z].southWall = false;
               mazeGrid[wallList[wallListIdx].x][wallList[wallListIdx].z].northWall = false;
            }
            if (wallList[wallListIdx].dir === SOUTH) 
            {
               wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: NORTH});
               wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: SOUTH});
               wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: WEST});
               mazeGrid[cellToCheck.x][cellToCheck.z].eastWall = false;
               mazeGrid[wallList[wallListIdx].x][wallList[wallListIdx].z].westWall = false;
            }
            if (wallList[wallListIdx].dir === NORTH) {
               wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: NORTH});
               wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: SOUTH});
               wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: EAST});
               mazeGrid[cellToCheck.x][cellToCheck.z].westWall = false;
               mazeGrid[wallList[wallListIdx].x][wallList[wallListIdx].z].eastWall = false;
            }
            visitedCells.push({x:cellToCheck.x, z:cellToCheck.z});
            wallList.splice(wallListIdx, 1);
  //           console.log("mazeGrid = ", mazeGrid);
            return mazeGrid;
         }
   
       }
       //const mazeGrid = [Array(width), Array(height)];
       const mazeGrid = [];
       const visitedCells = [];
       for (let i=0; i< width; i++) {
         mazeGrid.push(Array(height));
         visitedCells.push(Array(height));
       }
       const wallList = [];
       for (let i = 0; i<width; i++) {
          for (let j = 0; j< height; j++) {
            mazeGrid[i][j] = new MazeCell(true,true,true,true);
            visitedCells[i][j] = false;
          }
       }
   //    console.log("initial MazeGrid = ", mazeGrid);
       const startX = Math.floor(Math.random() * width);
       const startZ = Math.floor(Math.random() * height);
       visitedCells[startX][startZ] = true;
       wallList.push({x:startX, z:startZ, dir: NORTH});
       wallList.push({x:startX, z:startZ, dir: SOUTH});
       wallList.push({x:startX, z:startZ, dir: EAST});
       wallList.push({x:startX, z:startZ, dir: WEST});
   
       do {
    //      console.log("********************************");
     //     console.log("wallList.length = ", wallList.length);
          let currentWallListIdx = Math.floor(Math.random() * (wallList.length - 1));
          checkWall(currentWallListIdx);
       } while ((wallList.length > 0));
       return mazeGrid;
   }
   module.exports = createMazeGridPims;