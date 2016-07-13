// ----- CREATING NEW GAME INSTANCE -----
var game = new Phaser.Game(1000, 800, Phaser.AUTO, 'game-area'); //set resolution. phaser.auto will choose to render on canvas or webGL depending on availability.

var player;
var aliens;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var enemyBullet;
var firingTimer = 0;
var livingEnemies = [];
// var stateText;
// var score = 0;
// var scoreString = '';
// var scoreText;
// var lives;

// ------ PRELOADING ASSETS -----
var GameState = {
  //where images, audio, and game files are loaded before starting the game. load the game assets before the game starts
  preload: function () {
    game.load.image('starfield', 'assets/images/space.jpg'); //this loads images. first arg is key name, second arg is path to image
    game.load.image('kaboom', 'assets/images/explosion.gif-c200');
    game.load.image('bullet', 'assets/images/laser-multiple3.png');
    game.load.image('enemyBullet', 'assets/images/enemyball.gif');
    game.load.image('enemy', 'assets/images/enemyship2.png');
    game.load.image('player', 'assets/images/plane2.png');
    game.load.image('wormhole', 'assets/images/wormhole.gif');

  },

  // ------ CREATING GAME STATES -----
  //after loading images, audio, etc. we create the game state. executes after everything is loaded
  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    starfield = game.add.tileSprite(0, 0, 1000, 800, 'starfield'); //to load the background image into the main game, you have to create a new sprite for each image. this.game always refer to the MAIN GAME object. sprite() takes x, y coordinates and key of image object you want to place the image as arguments

    // creating bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet'); //FIND THE BULLET IMAGE
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet'); //FIND THE ENEMY BULLET IMAGE
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    // creating player
    player = game.add.sprite(400, 500, 'player');
    player.anchor.setTo(0.5, 0.5); //make anchor in the middle of image
    player.scale.setTo(1,-1); //flipping the image 180 degs vertically. -2 will flip it and change its dimension to double on the x axis
    game.physics.enable(player, Phaser.Physics.ARCADE);

    // creating enemies
    aliens = game.add.group();  //we are defining multiple ships as one group
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;
    createAliens();

    function createAliens () {
    for (var y = 0; y < 5; y++){ //how many rows of enemies
          for (var x = 0; x < 6; x++){ //how many enemies per row
              var alien = aliens.create(x * 128, y * 80, 'enemy'); //FIND THE ENEMY IMAGE. how close the enemies are placed next to each other
              alien.anchor.setTo(0.5, 0.5); //set anchor
              alien.scale.setTo(1,-1); //reverse image vertically
              alien.animations.add('fly', [], true); //set animation on ememyships
              alien.play('fly'); //play animation
              alien.body.moves = false;
          }
      }
    //setting position of enemy ships on the screen
    aliens.x = 140; //starting position of enemies
    aliens.y = 40; //starting position of enemies
    var tween = game.add.tween(aliens).to( { x: 300 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true); //makes the enemyships move together as a group. 2000 is the speed of left-right movement. {x:500} is how wide the left-right movement is

    //  When the tween loops it calls descend
    tween.onLoop.add(descend, this);
    }

    function setupInvader (invader) {
      invader.anchor.x = 0.5;
      invader.anchor.y = 0.5;
      invader.animations.add('kaboom');
    }
    function descend() {
    aliens.y += 10;
    }

    // create explosions
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    // create controls
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); //make spacebar the fire bullet button
  },

  // ----- CONFIGURE OUR FRAMES PER SECOND -----
  //this is how you game plays. it updates the frames depending on user inputs, etc. this is executed multiple times per second
  update: function() {
     starfield.tilePosition.y += 2; //this scrolls ur background horizontally
    //  bullets.angle += 0.5;

     if (player.alive){
        //  Reset the player, then check for movement keys
        player.body.velocity.setTo(0, 0);

        if (cursors.left.isDown){
            player.body.velocity.x = -200;
        }
        if (cursors.right.isDown){
            player.body.velocity.x = 200;
        }
        if (cursors.up.isDown){
            player.body.velocity.y = -200;
        }
        if (cursors.down.isDown){
            player.body.velocity.y = 200;
        }

        //  Firing?
        if (fireButton.isDown){
            fireBullet();
        }
        if (game.time.now > firingTimer){
            enemyFires();
        }

        function enemyFires () {
          enemyBullet = enemyBullets.getFirstExists(false); //  Grab the first bullet we can from the pool
          livingEnemies.length=0;
          aliens.forEachAlive(function(alien){
              livingEnemies.push(alien); //put every living enemy in an array defined at the very top
          });

          if (enemyBullet && livingEnemies.length > 0){
              var random = game.rnd.integerInRange(0,livingEnemies.length-1);
              var shooter=livingEnemies[random]; // randomly select one of the enemyships
              enemyBullet.reset(shooter.body.x, shooter.body.y); // and fire the bullet from this enemy
              game.physics.arcade.moveToObject(enemyBullet,player,220); //how fast the bullet flies
              firingTimer = game.time.now + 800; //how frequent the bullet fires
          }
        }

        function fireBullet () {
            if (game.time.now > bulletTime){ // To avoid them being allowed to fire too fast we set a time limit
                bullet = bullets.getFirstExists(false); // Grab the first bullet we can from the

                if (bullet){
                  bullet.reset(player.x, player.y + -43); //and fire it.
                  bullet.body.velocity.y = -400;
                  bulletTime = game.time.now + 200; //how fast the bullet fires
                }
            }

        }

        // Run collision
        game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this); //define collisionHandler below
        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this); //define enemyhitsplayer below
     }

        function collisionHandler (bullet, alien) {
          // When a bullet hits an alien we kill them both
          bullet.kill();
          alien.kill();

          //  Increase the score
          // score += 20;
          // scoreText.text = scoreString + score;

          //  Create an explosion
          var explosion = explosions.getFirstExists(false);
          explosion.reset(alien.body.x, alien.body.y);
          explosion.play('kaboom', 30, false, true);

          if (aliens.countLiving() === 0){
              // score += 1000;
              // scoreText.text = scoreString + score;
              enemyBullets.callAll('kill',this);
              // stateText.text = " You Won, \n Click to restart";
              // stateText.visible = true;

              //the "click to restart" handler
              // game.input.onTap.addOnce(restart,this);
          }
        }


        function enemyHitsPlayer (player,bullet) {
          bullet.kill();
          // live = lives.getFirstAlive();

          // if (live){
            // live.kill();
          // }

          //  create an explosion
          var explosion = explosions.getFirstExists(false);
          explosion.reset(player.body.x, player.body.y);
          explosion.play('kaboom', 30, false, true);

          // When the player dies
          // if (lives.countLiving() < 1){
          //     player.kill();
          //     enemyBullets.callAll('kill');
          //
          //     stateText.text=" GAME OVER \n Click to restart";
          //     stateText.visible = true;
          //
          //     //the "click to restart" handler
          //     game.input.onTap.addOnce(restart,this);
          // }




        }

  }
};

//initate the phaser framework
game.state.add('GameState', GameState); //to add the state we created above to the game. first argument 'GameState' is name of object and second argument is the object itself, defined above
game.state.start('GameState'); //to initiate the game by firing the state up (State is defined above)
