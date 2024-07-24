const createCollectibles = (numCollectibles, mazeHeight, mazeWidth) => {
 const collectables = [];
 while (collectables.length < numCollectibles) {
    const collectableX = Math.floor(Math.random()*mazeWidth);
    const collectableY = Math.floor(Math.random()*mazeHeight);
    if (!collectables.some(({x, y}) => {return x === collectableX && y === collectableY})) {
        collectables.push({x: collectableX, y: collectableY});
    }
 }
 return collectables;
}
module.exports = createCollectibles;