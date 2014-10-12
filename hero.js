module.exports = function (gameData, helpers) {
  // kill when possible

  var nearbyEnemy = helpers.getNearbyWeakestEnemy(gameData);

  if (nearbyEnemy && nearbyEnemy.tile.health < 30) {
    return nearbyEnemy.direction;
  }

  // act as a careful assassin

  var myHero = gameData.activeHero;
  if (myHero.health < 50) { return helpers.findNearestHealthWell(gameData); }
  return helpers.findNearestWeakerEnemy(gameData);
};
