import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as THREE from "three";
import '../../App.css';
import * as MAP from '../../utilities/map';
import * as PLAYER from '../../utilities/player';
import * as COLLECTABLE from '../../utilities/collectible'
import OverHeadView from '../overHeadView'

function Maze({ mapFromServer, collectablesFromServer, playerFromServer, otherPlayersFromServer }) {
  console.log('maze otherPlayersFromServer = ', otherPlayersFromServer);
  console.log('maze playerFromServer = ', playerFromServer);
  console.log('maze mapFromServer = ', mapFromServer);
  console.log('maze collectablesFromServer = ', collectablesFromServer);
  const scene = new THREE.Scene();
  const mazeGrid = MAP.getMazeGridObj(scene, mapFromServer);

  const playerObj = playerFromServer;
  const rendererRef = useRef();

  useEffect(() => {

    const mazeCanvas = document.getElementById("mazeCanvas");
    const overHeadView = document.getElementById("overHeadView");

    rendererRef.current = new THREE.WebGLRenderer({ canvas: mazeCanvas });
    playerObj.camera = new THREE.PerspectiveCamera( 75, mazeCanvas.width/mazeCanvas.height, 0.1, 1000 );
    playerObj.camera.position.x = playerObj.player.gridY;
    playerObj.camera.position.y = 0;
    playerObj.camera.position.z = playerObj.player.gridX;
    const collectables = COLLECTABLE.createCollectiblesList(collectablesFromServer.length, mazeGrid, collectablesFromServer);
    COLLECTABLE.placeCollectableGraphics(scene, collectables);

    PLAYER.placeOtherPlayerGraphics(scene, otherPlayersFromServer);

    window.addEventListener("keydown", function(evt) { PLAYER.doKeyDown(evt, playerObj) }, false);
    window.addEventListener("keyup", function(evt) { PLAYER.doKeyUp(evt, playerObj) }, false);


    const playerPointLight = new THREE.PointLight();
    playerPointLight.position.set( 0, 0, 0 );
    scene.add( playerPointLight );
    let myReq;
    var render = function () {

      myReq = window.requestAnimationFrame( render );

      const now = Date.now();
      let deltaTime = now - playerObj.last_update;
      playerObj.last_update = now;

      PLAYER.doPlayerMove(
        mazeGrid, 
        playerObj,
        deltaTime,
        collectables,
        scene
        );

        playerPointLight.position.x = playerObj.camera.position.x;
        playerPointLight.position.y = playerObj.camera.position.y;
        playerPointLight.position.z = playerObj.camera.position.z;

        COLLECTABLE.doCollectablesMove(collectables, deltaTime);
 
  //      console.log("coordinates ", playerObj.player.gridX, playerObj.player.gridY);
  //      console.log("playerDirection ", playerObj.playerDirection);

/*   console.log("walkingDistance", walkingDistance.current);
  console.log("playerInput", playerObj.playerInput);
  console.log("turningArc", turningArc.current);
  console.log("currentDirection", currentDirection.current);
  console.log("plauerDirection", playerDirection.current);
  console.log("camera y", playerObj.camera.rotation.y);
  console.log("playerState", playerState.current);
  console.log('*************************************'); */
  //    overHeadView.innerHTML = <OverHeadView mazeGrid={mazeGrid} playerObj={playerObj} />;

      ReactDOM.render(
        <OverHeadView mazeGrid={mazeGrid} playerObj={playerObj} collectables={collectables} otherPlayers={otherPlayersFromServer} />,
        overHeadView
      )

      rendererRef.current.render(scene, playerObj.camera);
   };

   render();

   return function cleanup() {
    window.removeEventListener("keydown", function(evt) { PLAYER.doKeyDown(evt, playerObj) }, false);
    window.removeEventListener("keyup", function(evt) { PLAYER.doKeyUp(evt, playerObj) }, false);
    window.cancelAnimationFrame(myReq)
   }

  });

  return (
    <>
      <canvas id="mazeCanvas" width="600" height="450" />
      <div id="overHeadView" />
    </>
    )
}

export default Maze;
