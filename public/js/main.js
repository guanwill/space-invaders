// ----- CREATING NEW GAME INSTANCE -----
var game = new Phaser.Game(1550, 860, Phaser.AUTO, 'game-area'); //set resolution. phaser.auto will choose to render on canvas or webGL depending on availability.

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
var livingBoss = [];
var boss;
var meteor;

var stateText;
var score = 0;
var scoreString = '';
var scoreText;
var lives;

// ------ PRELOADING ASSETS -----
var GameState = {
  //where images, audio, and game files are loaded before starting the game. load the game assets before the game starts
  preload: function () {
    game.load.image('starfield', 'assets/images/space.jpg'); //this loads images. first arg is key name, second arg is path to image
    game.load.image('kaboom', 'assets/images/explosion.gif-c200');
    game.load.image('bullet', 'assets/images/blueball.png');
    game.load.image('bluebullet', 'assets/images/laser-multiple3.png');
    game.load.image('enemyBullet', 'assets/images/enemyball.gif');
    game.load.image('enemy', 'assets/images/enemyship2.png');
    game.load.image('player', 'assets/images/plane2.png');
    game.load.image('wormhole', 'assets/images/wormhole.gif');
    game.load.image('hpbar', 'assets/images/enemyship.gif');
    game.load.image('boss', 'assets/images/boss2.png');
    game.load.image('meteor', 'assets/images/bossBullet.png');
  },

  // ------ CREATING GAME STATES -----
  //after loading images, audio, etc. we create the game state. executes after everything is loaded
  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    starfield = game.add.tileSprite(0, 0, 1530, 860, 'starfield'); //to load the background image into the main game, you have to create a new sprite for each image. this.game always refer to the MAIN GAME object. sprite() takes x, y coordinates and key of image object you want to place the image as arguments
    game.world.setBounds(-55, 20, 1590, 880);

    // creating bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    // bullets.createMultiple(30, 'bullet'); //FIND THE BULLET IMAGE
    bullets.createMultiple(90, 'bluebullet'); //FIND THE BULLET IMAGE
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //add second bullet
    bullets2 = game.add.group();
    bullets2.enableBody = true;
    bullets2.physicsBodyType = Phaser.Physics.ARCADE;
    bullets2.createMultiple(90, 'bullet'); //FIND THE BULLET IMAGE
    bullets2.setAll('anchor.x', 0.5);
    bullets2.setAll('anchor.y', 1);
    bullets2.setAll('outOfBoundsKill', true);
    bullets2.setAll('checkWorldBounds', true);

    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(90, 'enemyBullet'); //FIND THE ENEMY BULLET IMAGE
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //create meteor effect
    meteors = game.add.group();
    meteors.enableBody = true;
    meteors.physicsBodyType = Phaser.Physics.ARCADE;
    meteors.createMultiple(90, 'meteor'); //FIND THE BULLET IMAGE
    meteors.setAll('anchor.x', 0.5);
    meteors.setAll('anchor.y', 1);
    meteors.setAll('outOfBoundsKill', true);
    meteors.setAll('checkWorldBounds', true);

    // creating player
    player = game.add.sprite(800, 800, 'player');
    player.anchor.setTo(0.5, 0.5); //make anchor in the middle of image
    player.scale.setTo(1,-1); //flipping the image 180 degs vertically. -2 will flip it and change its dimension to double on the x axis
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;

    // creating enemies
    aliens = game.add.group();  //we are defining multiple ships as one group
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;
    createAliens();

    function createAliens () {
    for (var y = 0; y < 7; y++){ //how many rows of enemies
          for (var x = 0; x < 8; x++){ //how many enemies per row
              var alien = aliens.create(x * 98, y * 35, 'enemy'); //FIND THE ENEMY IMAGE. how close the enemies are placed next to each other
              alien.anchor.setTo(0.5, 0.5); //set anchor
              alien.scale.setTo(0.5,-0.5); //reverse image vertically
              alien.animations.add('fly', [], true); //set animation on ememyships
              alien.play('fly'); //play animation
              alien.body.moves = false;
          }
      }
    //setting position of enemy ships on the screen
    aliens.x = 230; //starting position of enemies
    aliens.y = 40; //starting position of enemies
    var tween = game.add.tween(aliens).to( { x: 450 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true); //makes the enemyships move together as a group. 2000 is the speed of left-right movement. {x:500} is how wide the left-right movement is

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
    firebluebullet = game.input.keyboard.addKey(Phaser.Keyboard.ONE);

    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 50, scoreString + score, { font: '24px Arial 2P', fill: 'white' });

    //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 200, 50, 'Lives : ', { font: '24px Arial', fill: 'white' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '34px Press Start 2P', fill: 'yellow' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (var i = 0; i < 3; i++){  //set number of lives
        var hpbar = lives.create(game.world.width - 220 + (50 * i), 120, 'hpbar'); //120 is setting x asix position.
        hpbar.anchor.setTo(0.5, 0.5);
        hpbar.scale.setTo(0.5, 0.5);
        // ship.angle = 90;
        hpbar.alpha = 0.4;
    }
  },

  // ----- CONFIGURE OUR FRAMES PER SECOND -----
  //this is how you game plays. it updates the frames depending on user inputs, etc. this is executed multiple times per second
  update: function() {
     starfield.tilePosition.y += 2; //this scrolls ur background horizontally

     if (player.alive){
        //  Reset the player, then check for movement keys
        player.body.velocity.setTo(0, 0);

        if (cursors.left.isDown){
            player.body.velocity.x = -300;
        }
        if (cursors.right.isDown){
            player.body.velocity.x = 300;
        }
        if (cursors.up.isDown){
            player.body.velocity.y = -300;
        }
        if (cursors.down.isDown){
            player.body.velocity.y = 300;
        }

        //  Firing?
        if (fireButton.isDown){
            fireBullet();
        }
        if (firebluebullet.isDown){
            fireBullet2();
        }
        if (game.time.now > firingTimer){
            enemyFires();
            meteorFires();
        }

        // configuring boss bullets
        function meteorFires () {
          meteor = meteors.getFirstExists(false); //  Grab the first meteor we can from the pool
          meteor.reset(50, 50); // for meteoring purposes
          game.physics.arcade.moveToObject(meteor,player,320); //how frequent the bullet flies and who to aim the bullet at
          firingTimer = game.time.now + 800; //how fast the bullet fires. the lower the more fast
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
              game.physics.arcade.moveToObject(enemyBullet,player,220); //how fast the bullet flies and who to aim the bullet at
              firingTimer = game.time.now + 50; //how frequent the bullet fires. the lower the more frequent
          }
        }

        function fireBullet () {
            if (game.time.now > bulletTime){ // To avoid them being allowed to fire too fast we set a time limit
                bullet = bullets.getFirstExists(false); // Grab the first bullet we can

                if (bullet){
                  bullet.reset(player.x, player.y + -43); //and fire it.
                  bullet.body.velocity.y = -400;
                  bulletTime = game.time.now + 250; //how fast the bullet fires
                }
            }
        }

        function fireBullet2 () {
            if (game.time.now > bulletTime){ // To avoid them being allowed to fire too fast we set a time limit
                bullet = bullets2.getFirstExists(false); // Grab the first bullet we can from the

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
        game.physics.arcade.overlap(bullets2, aliens, collisionHandler, null, this); //define collisionHandler below
        game.physics.arcade.overlap(meteors, player, meteorHitsPlayer, null, this); //define enemyhitsplayer below
     }

        function meteorHitsPlayer (player,bullet) {
          bullet.kill();
          live = lives.getFirstAlive();

          if (live){
            live.kill();
          }

          //  create an explosion
          var explosion = explosions.getFirstExists(false);
          explosion.reset(player.body.x, player.body.y);
          explosion.play('kaboom', 30, false, true);

          // When the player dies
          if (lives.countLiving() < 1){
              player.kill();
              meteors.callAll('kill');
              enemyBullets.callAll('kill');
              stateText.text=" GAME OVER \n Click to restart";
              stateText.visible = true;
              game.input.onTap.addOnce(restart,this); //the "click to restart" handler
          }

          //  A new level starts
          function restart () {
              lives.callAll('revive'); //resets the life count
              aliens.removeAll();
              createAliens(); // And brings the aliens back from the dead
              player.revive(); //revives the player
              stateText.visible = false; //hides the text
              scoreString = 'Score : ';
              score = 0;
          }

          function createAliens () {
          for (var y = 0; y < 7; y++){ //how many rows of enemies
                for (var x = 0; x < 8; x++){ //how many enemies per row
                    var alien = aliens.create(x * 98, y * 35, 'enemy'); //FIND THE ENEMY IMAGE. how close the enemies are placed next to each other
                    alien.anchor.setTo(0.5, 0.5); //set anchor
                    alien.scale.setTo(0.5,-0.5); //reverse image vertically
                    alien.animations.add('fly', [], true); //set animation on ememyships
                    alien.play('fly'); //play animation
                    alien.body.moves = false;
                }
            }
          //setting position of enemy ships on the screen
          aliens.x = 230; //starting position of enemies
          aliens.y = 40; //starting position of enemies
          var tween = game.add.tween(aliens).to( { x: 450 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true); //makes the enemyships move together as a group. 2000 is the speed of left-right movement. {x:500} is how wide the left-right movement is

          //  When the tween loops it calls descend
          tween.onLoop.add(descend, this);
          }
          function descend() {
          aliens.y += 10;
          }
        }

        function collisionHandler (bullet, alien) {
          // When a bullet hits an alien we kill them both
          bullet.kill();
          alien.kill();

          //  Increase the score
          score += 20;
          scoreText.text = scoreString + score;

          //  Create an explosion
          var explosion = explosions.getFirstExists(false);
          explosion.reset(alien.body.x, alien.body.y);
          explosion.play('kaboom', 30, false, true);

          if (aliens.countLiving() === 0){
              score += 1000;
              meteors.callAll('kill');
              enemyBullets.callAll('kill');
              player.kill();
              stateText.text = "YOU WON!\n Click to continue";
              stateText.visible = true;  //show above text
              game.input.onTap.addOnce(continuee, this); // the "click to restart" handler
          }

          // -----RESTART GAME AFTER KILLING ALL MINIONS-----
          function continuee () {
              // lives.callAll('revive'); //resets the life count
              aliens.removeAll();
              createAliens(); // And brings the aliens back from the dead
              player.revive(); //revives the player
              stateText.visible = false; //hides the text
              // scoreString = 'Score : ';
              // score = 0;
          }

          function createAliens () {
          for (var y = 0; y < 7; y++){ //how many rows of enemies
                for (var x = 0; x < 8; x++){ //how many enemies per row
                    var alien = aliens.create(x * 98, y * 35, 'enemy'); //FIND THE ENEMY IMAGE. how close the enemies are placed next to each other
                    alien.anchor.setTo(0.5, 0.5); //set anchor
                    alien.scale.setTo(0.5,-0.5); //reverse image vertically
                    alien.animations.add('fly', [], true); //set animation on ememyships
                    alien.play('fly'); //play animation
                    alien.body.moves = false;
                }
            }
          //setting position of enemy ships on the screen
          aliens.x = 230; //starting position of enemies
          aliens.y = 40; //starting position of enemies
          var tween = game.add.tween(aliens).to( { x: 450 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true); //makes the enemyships move together as a group. 2000 is the speed of left-right movement. {x:500} is how wide the left-right movement is

          //  When the tween loops it calls descend
          tween.onLoop.add(descend, this);
          }
          function descend() {
              boss.y += 10;
          }

        }

        function enemyHitsPlayer (player,bullet) {
          bullet.kill();
          live = lives.getFirstAlive();

          if (live){
            live.kill();
          }

          //  create an explosion
          var explosion = explosions.getFirstExists(false);
          explosion.reset(player.body.x, player.body.y);
          explosion.play('kaboom', 30, false, true);

          // When the player dies
          if (lives.countLiving() < 1){
              player.kill();
              enemyBullets.callAll('kill');
              stateText.text=" GAME OVER \n Click to restart";
              stateText.visible = true;
              game.input.onTap.addOnce(restart,this); //the "click to restart" handler
          }

          //  A new level starts
          function restart () {
              lives.callAll('revive'); //resets the life count
              aliens.removeAll();
              createAliens(); // And brings the aliens back from the dead
              player.revive(); //revives the player
              stateText.visible = false; //hides the text
              scoreString = 'Score : ';
              score = 0;
          }

          function createAliens () {
          for (var y = 0; y < 7; y++){ //how many rows of enemies
                for (var x = 0; x < 8; x++){ //how many enemies per row
                    var alien = aliens.create(x * 98, y * 35, 'enemy'); //FIND THE ENEMY IMAGE. how close the enemies are placed next to each other
                    alien.anchor.setTo(0.5, 0.5); //set anchor
                    alien.scale.setTo(0.5,-0.5); //reverse image vertically
                    alien.animations.add('fly', [], true); //set animation on ememyships
                    alien.play('fly'); //play animation
                    alien.body.moves = false;
                }
            }
          //setting position of enemy ships on the screen
          aliens.x = 230; //starting position of enemies
          aliens.y = 40; //starting position of enemies
          var tween = game.add.tween(aliens).to( { x: 450 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true); //makes the enemyships move together as a group. 2000 is the speed of left-right movement. {x:500} is how wide the left-right movement is

          //  When the tween loops it calls descend
          tween.onLoop.add(descend, this);
          }
          function descend() {
          aliens.y += 10;
          }

          //---------SECOND BULLET CREATION AND COLLISION EFFECTS---------

          function collisionHandler (bullets2, alien) {
            // When a bullet hits an alien we kill them both
            bullets2.kill();
            alien.kill();

            //  Create an explosion
            var explosion = explosions.getFirstExists(false);
            explosion.reset(alien.body.x, alien.body.y);
            explosion.play('kaboom', 30, false, true);

            if (aliens.countLiving() === 0){
                enemyBullets.callAll('kill',this);

            }
          }
          function enemyHitsPlayer (player,bullets2) {
            bullets2.kill();

            var explosion = explosions.getFirstExists(false);
            explosion.reset(player.body.x, player.body.y);
            explosion.play('kaboom', 30, false, true);
          }

          //---------METEOR BULLET CREATION AND COLLISION EFFECTS---------

          function collisionHandler (bullets2, alien) {
            // When a bullet hits an alien we kill them both
            bullets2.kill();
            alien.kill();
            var explosion = explosions.getFirstExists(false);
            explosion.reset(alien.body.x, alien.body.y);
            explosion.play('kaboom', 30, false, true);

            if (aliens.countLiving() === 0){
                enemyBullets.callAll('kill',this);
            }
          }
          function enemyHitsPlayer (player,bullets2) {
            bullets2.kill();
            //  create an explosion
            var explosion = explosions.getFirstExists(false);
            explosion.reset(player.body.x, player.body.y);
            explosion.play('kaboom', 30, false, true);
          }

        }
  }
};

//initate the phaser framework
game.state.add('GameState', GameState); //to add the state we created above to the game. first argument 'GameState' is name of object and second argument is the object itself, defined above
game.state.start('GameState'); //to initiate the game by firing the state up (State is defined above)
