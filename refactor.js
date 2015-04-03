/**
 * each()
 *
 * functional array iteration
 */
var each = function (arr, func) {
  for (var it = 0, len = arr.length; i < len; i++) {
    func(arr[it], it);
  }
};

/**
 * eachTile()
 *
 * functional map traversal
 */
var eachTile = function (board, func) {
  var width = board.lengthOfSide - 1,
      height = width;

  for (var x = 0, x < width; x++) {
    for (var y = 0; y < height; y++) {
      func(board.tiles[y][x], x, y);
    }
  }
};

/**
 * getTiles()
 *
 * traverses the map looking for given tile types
 * returns an array of tiles
 */
var getTiles = function (board, types) {
  var tiles = [];

  eachTile(board, function (tile, x, y) {
    if (types[tile.type]) { tiles[tiles.length] = tile; }
  });

  return tiles;
};

/**
 * getPaths()
 *
 * traverses the map generating an array of valuable tiles
 * extended with some properties
 *
 * *   path
 * *   safePath
 *
 * The paths always include the current tile as first node. If no movements
 * are required (adjacent), the distance between tiles will be 1
 */

var getPaths = function (gameData) {
  var types = {
    'Hero': true,
    'HealthWell': true,
    'DiamondMine': true,
    'Bones': true
  };

  var tiles = getTiles(gameData.board, types),
      paths = [];

  each(tiles, function (tile) {
    paths[paths.length] = {
      fast: findFastPath(board, from, to),
      safe: findSafePath(board, from, to)
    };
  });

  return paths;
};

module.exports = {
  each: each,
  getPaths: getPaths
};

/**
 * findNearestObject()
 * 
 * Returns an object with certain properties of the nearest object we are
 * looking for
 *
 *     {
 *       direction: correctDirection,
 *       distance: distance,
 *       coords: finalCoords
 *     }
 */
 
var findNearestObject = function (board, fromTile, tileCallback) {
  // Storage queue to keep track of places the fromTile has been
  var queue = [];

  // Keeps track of places the fromTile has been for constant time lookup
  // later
  var visited = {};

  // Variable assignments for fromTile's coordinates
  var dft = fromTile.distanceFromTop;
  var dfl = fromTile.distanceFromLeft;

  // Stores the coordinates, the direction fromTile is coming from, and it's
  // location
  var visitInfo = [dft, dfl, 'None', 'START'];

  // Just a unique way of storing each location we've visited
  visited[dft + '|' + dfl] = true;

  // Push the starting tile on to the queue
  queue.push(visitInfo);

  // While the queue has a length
  while (queue.length > 0) {

    // Shift off first item in queue
    var coords = queue.shift();

    // Reset the coordinates to the shifted object's coordinates
    var dft = coords[0];
    var dfl = coords[1];

    // Loop through cardinal directions
    var directions = ['North', 'East', 'South', 'West'];
    
    for (var i = 0; i < directions.length; i++) {

      // For each of the cardinal directions get the next tile...
      var direction = directions[i];

      // ...Use the getTileNearby helper method to do this
      var nextTile = getTileNearby(board, dft, dfl, direction);

      // If nextTile is a valid location to move...
      if (nextTile) {

        // Assign a key variable the nextTile's coordinates to put into our
        // visited object later
        var key = nextTile.distanceFromTop + '|' + nextTile.distanceFromLeft;

        var isGoalTile = false;
        try {
          isGoalTile = tileCallback(nextTile);
        } catch(err) {
          isGoalTile = false;
        }

        // If we have visited this tile before
        if (visited.hasOwnProperty(key)) {

          // Do nothing--this tile has already been visited

        // Is this tile the one we want?
        } else if (isGoalTile) {

          // This variable will eventually hold the first direction we went
          // on this path
          var correctDirection = direction;

          // This is the distance away from the final destination that will
          // be incremented in a bit
          var distance = 1;

          // These are the coordinates of our target tileType
          var finalCoords = [
            nextTile.distanceFromTop,
            nextTile.distanceFromLeft
          ];

          // Loop back through path until we get to the start
          while (coords[3] !== 'START') {

            // Haven't found the start yet, so go to previous location
            correctDirection = coords[2];

            // We also need to increment the distance
            distance++;

            // And update the coords of our current path
            coords = coords[3];
          }

          //Return object with the following pertinent info
          return {
            direction: correctDirection,
            distance: distance,
            coords: finalCoords
          };

          // If the tile is unoccupied, then we need to push it into our queue
        } else if (nextTile.type === 'Unoccupied') {

          queue.push([
            nextTile.distanceFromTop,
            nextTile.distanceFromLeft,
            direction,
            coords
          ]);

          // Give the visited object another key with the value we stored
          // earlier
          visited[key] = true;
        }
      }
    }
  }

  // There is no way to get where we want to go
  return false;
};
