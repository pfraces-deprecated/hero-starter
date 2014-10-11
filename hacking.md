Hacking
=======

In order to start hacking my hero's brain I want to define my preferences first

There are several leaderboards:

*   Overall damage dealt
*   Overall deaths
*   Overall diamonds earned
*   Overall graves robbed
*   Overall health given
*   Overall health recovered
*   Overall kills
*   Overall losses
*   Overall mines captured
*   Overall wins
*   Average damage dealt
*   Average deaths
*   Average diamonds earned
*   Average graves robbed
*   Average health given
*   Average health recovered
*   Average kills
*   Average losses
*   Average mines captured
*   Average wins
*   Most recent battle damage dealt
*   Most recent battle diamonds earned
*   Most recent battle graves robbed
*   Most recent battle health given
*   Most recent battle health recovered
*   Most recent battle kills
*   Most recent battle mines captured

I want to focus just in one of them

Being the **overall damage dealt** the default shown, it is a good candidate. But I also want to be useful for the
teams where I fight with, and the damage dealt is not directly related with the victory of the team.

The winner team is which kill all enemies or, after 1250 turns, which has more diamonds earned. At this initial phase
of the hero development I just one to focus on one win condition and I prefer the **kill all enemies** one

Since the average leatherboards statistically leads to higher overall ranking I will focus on the **average kills**
leaderboard

Thoughts from 1st day (October, 11 2014)
----------------------------------------

I have chosen the **Careful assasin** as starting point

```js
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
```

### The good

*   We won!
*   Hero survived!
*   140 damage dealt

### The bad

*   Hero didn't kill
*   Trying to kill an enemy while he is using a health well is useless. You earn damage points but didn't kill him since
    your damage (10 + 20) is equal to the healing well recovery (30). Meanwhile he is doing 20 damage to you
