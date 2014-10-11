Javascript Battle - Hero Starter Repo
=====================================

Usage
-----

If you take a look at `hero.js`, you will notice that there are different move functions - most of which are commented out. Each function describes a specific type of hero behavior. 

*   The "Northerner" cares about moving North...all the time.
*   The "Blind Man" moves randomly around the board.
*   The "Unwise Assassin" only cares about killing other players, possibly to his own demise.
*   The "Careful Assassin" goes after other players as well, but cares more about his health than the "Unwise Assassin."
*   The "Safe Diamond Miner" cares about mining diamonds and making sure he or she is alive at the end of the game to 
    enjoy the wealth.
*   The "Selfish Diamond Miner" cares about mining diamonds, but will also capture his own team's diamond mines.
*   The "Coward" will find the nearest health well and stay there.

If you want to try something different for tomorrow's game uncomment one of the heroes and try it out.

[Watch](http://javascriptbattle.com/#replay) tomorrow's game and see how your hero does. Each day is going to offer a unique battle as each player alters which hero they decide to play with.

Once you get acclimated to the different types of heroes and think you want to give writing your own hero a shot, try altering some of the code. Maybe you want your miner to wait a little longer before going to a health well? What if your health nut was aware of where the nearest enemy was and tried to keep away? How about if the aggressor became a real berserker? The possibilities are endless!!! And that is exactly how we want it. Go crazy and change your hero however you want. Just remember to track your changes with Git by following the process above.

If you are looking for even more of a challenge, go ahead and take a look at the helpers.js file and begin picking apart our helper methods. Is there anyway you could adapt our pathfinding algorithm and use a variant in your hero.js file? What other helper methods should be available to your hero that we did not include? Go ahead and make any changes you want to the helpers.js file.

[Stop by](http://javascriptbattle.com/#page-top) the site tomorrow and see how your hero did. We encourage you to continue to make changes to your hero repo as often as you like. We hope this experience will both be an enjoyable and instructive experience. 

If we can make our site better in any way or make any instructions or code more explicit, please let us know. Until then, may the javascripts be with you!

Testing
-------

We have a user-friendly testing site where you can upload your hero.js file and see immediate results in a simulated game.  Check it out [here](http://codetester.javascriptbattle.com/).

Additionally, you can still test your hero code on your own!  There are two ways to do this:

### Option 1: Make sure your code doesn't have errors

*   On the command line, navigate to your hero code directory.
*   After making sure you have Node and NPM installed, type in the following commands:

        npm install
        npm test

*   If both tests pass, your code doesn't have any obvious errors!

### Option 2: Put your hero in a mini-battle

*   On the command line, navigate to your hero directory.
*   After making sure you have Node installed, type in the following command:

        node test_your_hero_code.js
        
*   This will run and print out the results of a "mini-game" of only 15 turns which takes place on a 5x5 game board 
    against a single enemy hero.
*   The command line will output what the board looks like at each turn, and will output the moves your hero tried to 
    make each turn.
*   Your hero will be denoted by the code "H00", the enemy hero will be denoted by the code "H01"
*   Diamond mines will be denoted by "DXX" where the Xs are numbers
*   Health wells will be denoted by "WWW"
*   Remember, `test_your_hero_code.js` is there for you! Feel free to modify it however you like--we will only ever pull 
    in and use your `hero.js` and `helpers.js` files in each daily battle.
