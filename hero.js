/**
 * Careful Assassin
 * 
 * This hero will attempt to kill the closest weaker enemy hero.
 */

module.exports = function (gameData, helpers) {
  var myHero = gameData.activeHero;
  if (myHero.health < 50) { return helpers.findNearestHealthWell(gameData); }
  return helpers.findNearestWeakerEnemy(gameData);
};
