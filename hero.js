/**
 * Paladin
 *
 * A mix of priest and careful assasin
 *
 * It tries to heal teammates while keeping himself healthy, but if he has a
 * chance to kill, he does
 */

var paladin = function (gameData, helpers) {
  var myHero = gameData.activeHero;

  // kill affordable enemies

  var adjacentEnemy = helpers.getAdjacentWeakestEnemy(gameData);

  if (adjacentEnemy && adjacentEnemy.tile.health <= 30) {
    return adjacentEnemy.direction;
  }

  // heal affordable team members

  var adjacentTeamMember = helpers.getAdjacentWeakestTeamMember(gameData);

  if (adjacentTeamMember &&
      adjacentTeamMember.tile.health < (myHero.health - 40)) {
    return adjacentTeamMember.direction;
  }

  // keep yourself healthy

  var adjacentHealthWell = helpers.getAdjacentHealthWell(gameData);

  if (adjacentHealthWell && myHero.health < 100) {
    return adjacentHealthWell.direction;
  }

  if (myHero.health <= 60) { return helpers.findNearestHealthWell(gameData); }

  // go for a weaker enemy if any
  // or go for a health well otherwise

  return (
      helpers.findNearestWeakerEnemy(gameData) ||
      helpers.findNearestHealthWell(gameData)
  );
};

module.exports = paladin;
