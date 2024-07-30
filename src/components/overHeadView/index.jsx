import React from 'react';
import * as MAP from '../../utilities/map';

const OverHeadView = props => {
    const {  playerObj, mazeGrid, collectables } = props;
    const { player : { gridX = 0, gridY = 0, direction = 100 }} = playerObj;
    return (
        <>
            <div style={{paddingLeft: "200px"}}>PLAYER POSITION ({`${gridX}, ${gridY}`})</div>
            <div style={{paddingLeft: "200px"}}>PLAYER DIRECTION ({`${direction}`})</div>
            <div style={{paddingLeft: "200px"}}>NORTH ({MAP.NORTH})</div>
            <div><div style={{float: "left", paddingTop: "150px"}}>WEST ({MAP.WEST})</div><div style={{float: "left"}}>{MAP.displayMazeGrid(mazeGrid, playerObj, collectables)}</div><div style={{float: "left", paddingTop: "150px"}}>EAST ({MAP.EAST})</div></div>
            <div style={{clear: "both", paddingLeft: "200px"}}>SOUTH ({MAP.SOUTH})</div>
        </>
    );
}

export default OverHeadView;