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
 * getAdjacentTiles()
 *
 * Returns an array of tiles adjacent to the active hero
 * filtered by the provided callback
 */

var getAdjacentTiles = function (gameData, filter) {
  var myHero = gameData.activeHero,
      board = gameData.board;

  var y = myHero.distanceFromTop,
      x = myHero.distanceFromLeft;

  var directions = [
    'North',
    'East',
    'South',
    'West'
  ];

  var adjacentTiles = [];

  directions.forEach(function (direction) {
    var tile = getTileNearby(board, y, x, direction);

    if (!filter(tile)) { return; }

    adjacentTiles.push({
      direction: direction,
      tile: tile
    });
  });

  return adjacentTiles;
};

/**
 * getWeakestHero()
 *
 * Returns the weakest hero in the provided array
 * Returns false if the array is empty
 */

var getWeakestHero = function (heroes) {
  var weakestHero = false;

  heroes.forEach(function (hero) {
    if (!weakestHero || hero.tile.health < weakestHero.tile.health) {
      weakestHero = hero;
    }
  });

  return weakestHero;
};

/**
 * getAdjacentWeakestEnemy()
 *
 * Returns the weakest adjacent enemy if any
 * Returns false otherwise
 */

var getAdjacentWeakestEnemy = function (gameData) {
  var myHero = gameData.activeHero;

  var enemies = getAdjacentTiles(gameData, function (tile) {
    return tile.type === 'Hero' && tile.team !== myHero.team
  });

  return getWeakestHero(enemies);
};

/**
 * getAdjacentWeakestTeamMember()
 *
 * Returns the weakest adjacent team member if any
 * Returns false otherwise
 */

var getAdjacentWeakestTeamMember = function (gameData) {
  var myHero = gameData.activeHero;

  var teamMembers = getAdjacentTiles(gameData, function (tile) {
    return tile.type === 'Hero' && tile.team === myHero.team
  });

  return getWeakestHero(teamMembers);
};

/**
 * getAdjacentHealthWell()
 *
 * Returns a health well adjacent to the hero if any
 * Returns false otherwise
 */

var getAdjacentHealthWell = function (gameData) {
  var myHero = gameData.activeHero;

  var healthWells = getAdjacentTiles(gameData, function (tile) {
    return tile.type === 'HealthWell'
  });

  return healthWells.length && healthWells[0];
};

/**
 * findNearestObject()
 * 
 * Returns an object with certain properties of the nearest object we are looking for
 */
 
var findNearestObject = function (board, fromTile, tileCallback) {
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
 * Returns the direction of the nearest health well available if any
 * Returns undefined otherwise
 */
 
var findNearestHealthWell = function (gameData) {
  var hero = gameData.activeHero;
  var board = gameData.board;

  var pathInfoObject = findNearestObject(board, hero, function (tile) {
    return tile.type === 'HealthWell';
  });

  return pathInfoObject.direction;
};

/**
 * findNearestWeakerEnemy()
 * 
 * Returns the direction of the nearest enemy with lower health if any
 * Returns undefined otherwise
 */
 
var findNearestWeakerEnemy = function (gameData) {
  var myHero = gameData.activeHero;
  var board = gameData.board;

  var pathInfoObject = findNearestObject(board, myHero, function (tile) {
    var isWeakerEnemy = (
        tile.type === 'Hero' &&
        tile.team !== myHero.team &&
        tile.health <= myHero.health
    );

    return isWeakerEnemy;
  });

  return pathInfoObject.direction;
};

/**
 * findNearestAffordableEnemy()
 * 
 * Returns the direction of the nearest enemy which can be killed in the next
 * move if any
 *
 * Returns undefined otherwise
 */
 
var findNearestAffordableEnemy = function (gameData) {
  var myHero = gameData.activeHero;
  var board = gameData.board;

  var pathInfoObject = findNearestObject(board, myHero, function (tile) {
    var isAffordableEnemy = (
        tile.type === 'Hero' &&
        tile.team !== myHero.team &&
        tile.health <= 20
    );

    return isAffordableEnemy;
  });

  if (pathInfoObject && pathInfoObject.distance <= 2) {
    return pathInfoObject.direction;
  }
};

module.exports = {
  getAdjacentWeakestEnemy: getAdjacentWeakestEnemy,
  getAdjacentWeakestTeamMember: getAdjacentWeakestTeamMember,
  getAdjacentHealthWell: getAdjacentHealthWell,
  findNearestHealthWell: findNearestHealthWell,
  findNearestWeakerEnemy: findNearestWeakerEnemy,
  findNearestAffordableEnemy: findNearestAffordableEnemy
};
