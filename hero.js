var paladin = function (gameData, helpers) {
  var myHero = gameData.activeHero;

  // keep yourself healthy

  if (myHero.health <= 60) { return helpers.findNearestHealthWell(gameData); }

  // kill affordable enemies

  var adjacentEnemy = helpers.getAdjacentWeakestEnemy(gameData);

  if (adjacentEnemy && adjacentEnemy.tile.health < 30) {
    return adjacentEnemy.direction;
  }

  // heal affordable team members

  var adjacentTeamMember = helpers.getAdjacentWeakestTeamMember(gameData);

  if (adjacentTeamMember &&
      adjacentTeamMember.tile.health < (myHero.health - 40)) {
    return adjacentTeamMember.direction;
  }

  // default to careful assassin

  return helpers.findNearestWeakerEnemy(gameData);
};

module.exports = paladin;
