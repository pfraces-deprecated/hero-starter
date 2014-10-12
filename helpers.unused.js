/**
 * findNearestNonTeamDiamondMine()
 *
 * Returns the direction of the nearest non-team diamond mine or false, if there are no diamond mines
 */
 
var findNearestNonTeamDiamondMine = function (gameData) {
  var hero = gameData.activeHero;
  var board = gameData.board;

  // Get the path info object
  
  var pathInfoObject = helpers.findNearestObjectDirectionAndDistance(board, hero, function (mineTile) {
    if (mineTile.type === 'DiamondMine') {
      if (mineTile.owner) { return mineTile.owner.team !== hero.team; }
      return true;
    }
    
    return false;
  });

  // Return the direction that needs to be taken to achieve the goal
  return pathInfoObject.direction;
};

/**
 * findNearestUnownedDiamondMine()
 *
 * Returns the nearest unowned diamond mine or false, if there are no diamond mines
 */
 
var findNearestUnownedDiamondMine = function (gameData) {
  var hero = gameData.activeHero;
  var board = gameData.board;

  // Get the path info object
  
  var pathInfoObject = helpers.findNearestObjectDirectionAndDistance(board, hero, function (mineTile) {
    if (mineTile.type === 'DiamondMine') {
      if (mineTile.owner) { return mineTile.owner.id !== hero.id; }
      return true;
    }
    
    return false;
  });

  // Return the direction that needs to be taken to achieve the goal
  return pathInfoObject.direction;
};

/**
 * findNearestTeamMember()
 *
 * Returns the direction of the nearest friendly champion
 * (or returns false if there are no accessible friendly champions)
 */
 
var findNearestTeamMember = function (gameData) {
  var hero = gameData.activeHero;
  var board = gameData.board;

  // Get the path info object
  
  var pathInfoObject = helpers.findNearestObjectDirectionAndDistance(board, hero, function (heroTile) {
    return heroTile.type === 'Hero' && heroTile.team === hero.team;
  });

  // Return the direction that needs to be taken to achieve the goal
  return pathInfoObject.direction;
};
