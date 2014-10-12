/**
 * validCoordinates()
 * 
 * Returns false if the given coordinates are out of range
 */
 
var validCoordinates = function (board, y, x) {
  // board is a square
  var width = board.lengthOfSide - 1,
      height = board.lengthOfSide - 1;

  var outOfRange = (
      y < 0 ||
      x < 0 ||
      y > height ||
      x > width
  );

  return !outOfRange;
};

/**
 * getTileNearby()
 * 
 * Returns the tile from given starting point { x, y } when moving to a given
 * direction
 */
 
var getTileNearby = function (board, y, x, direction) {
  if (direction === 'North') { y -= 1; }
  else if (direction === 'East') { x += 1; }
  else if (direction === 'South') { y += 1; }
  else if (direction === 'West') { x -= 1; }
  else { return false; }

  if (validCoordinates(board, y, x)) { return board.tiles[y][x]; }
  return false;
};

/**
 * getNearbyEnemies()
 *
 * Returns an array of enemies adjacent to the given point { x, y }
 */

var getNearbyEnemies = function (board, y, x) {
  var directions = [
    'North',
    'East',
    'South',
    'West'
  ];

  var nearbyEnemies = [];

  directions.forEach(function (direction) {
    var tile = getTileNearby(board, y, x, direction);
    if (!tile) { return; }

    if (tile.type === 'Hero' && tile.team === 'Enemy') {
      nearbyEnemies.push({
        direction: direction,
        tile: tile
      });
    }
  });

  return nearbyEnemies;
};

/**
 * getNearbyWeakestEnemy()
 *
 * Return the weakest of the adjacent enemies if any
 * Return false if there are not adjacent enemies
 */

var getNearbyWeakestEnemy = function (gameData) {
  var hero = gameData.activeHero,
      board = gameData.board;

  var y = hero.distanceFromTop,
      x = hero.distanceFromLeft,
      enemies = getNearbyEnemies(board, y, x);

  var weakestEnemy = false;

  enemies.forEach(function (enemy) {
    if (!weakestEnemy || enemy.tile.health < weakestEnemy.tile.health) {
      weakestEnemy = enemy;
    }
  });

  return weakestEnemy;
};

/**
 * findNearestObjectDirectionAndDistance()
 * 
 * Returns an object with certain properties of the nearest object we are looking for
 */
 
var findNearestObjectDirectionAndDistance = function (board, fromTile, tileCallback) {
  // Storage queue to keep track of places the fromTile has been
  var queue = [];

  // Keeps track of places the fromTile has been for constant time lookup later
  var visited = {};

  // Variable assignments for fromTile's coordinates
  var dft = fromTile.distanceFromTop;
  var dfl = fromTile.distanceFromLeft;

  // Stores the coordinates, the direction fromTile is coming from, and it's location
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

        // Assign a key variable the nextTile's coordinates to put into our visited object later
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

          // This variable will eventually hold the first direction we went on this path
          var correctDirection = direction;

          // This is the distance away from the final destination that will be incremented in a bit
          var distance = 1;

          // These are the coordinates of our target tileType
          var finalCoords = [nextTile.distanceFromTop, nextTile.distanceFromLeft];

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

          queue.push([nextTile.distanceFromTop, nextTile.distanceFromLeft, direction, coords]);

          // Give the visited object another key with the value we stored earlier
          visited[key] = true;
        }
      }
    }
  }

  // If we are blocked and there is no way to get where we want to go, return false
  return false;
};

/**
 * findNearestHealthWell()
 * 
 * Returns the nearest health well or false, if there are no health wells
 */
 
var findNearestHealthWell = function (gameData) {
  var hero = gameData.activeHero;
  var board = gameData.board;

  // Get the path info object
  var pathInfoObject = findNearestObjectDirectionAndDistance(board, hero, function (healthWellTile) {
    return healthWellTile.type === 'HealthWell';
  });

  // Return the direction that needs to be taken to achieve the goal
  return pathInfoObject.direction;
};

/**
 * findNearestWeakerEnemy()
 * 
 * Returns the direction of the nearest enemy with lower health
 * (or returns false if there are no accessible enemies that fit this description)
 */
 
var findNearestWeakerEnemy = function (gameData) {
  var hero = gameData.activeHero;
  var board = gameData.board;

  // Get the path info object
  var pathInfoObject = findNearestObjectDirectionAndDistance(board, hero, function (enemyTile) {
    return enemyTile.type === 'Hero' && enemyTile.team !== hero.team && enemyTile.health <= hero.health;
  });

  // Return the direction that needs to be taken to achieve the goal
  // If no weaker enemy exists, will simply return undefined, which will
  // be interpreted as "Stay" by the game object
  return pathInfoObject.direction;
};

module.exports = {
  getNearbyWeakestEnemy: getNearbyWeakestEnemy,
  findNearestHealthWell: findNearestHealthWell,
  findNearestWeakerEnemy: findNearestWeakerEnemy
};
