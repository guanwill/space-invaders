// var express = require('express'),
// gamestat = require('./models/gamestat'),
// mongoose = require('mongoose');

// ----- CREATING NEW GAME INSTANCE -----
var game = new Phaser.Game(1550, 860, Phaser.AUTO, 'game-area'); //set resolution. phaser.auto will choose to render on canvas or webGL depending on availability.
console.log("hold key 'q' or 'w' instead of 'space' for a better attack");

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
var bulletSpeed = 300;
var meteorSpeed = 350;
var continuegame;

var stateText;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var name;

var meteorattacks = ['meteor', 'meteor2', 'meteor3', 'meteor4', 'meteor5']
var randomMeteorAttack = Math.floor(Math.random()*meteorattacks.length);
var enemyships = ['enemy2', 'enemy3', 'enemy4', 'enemy5', 'enemy6', 'enemy7', 'enemy8'];
var enemyattacks = ['enemyBullet', 'greenball', 'redball', 'purpleball', 'yellowball', 'spikyball', 'wormholeBullet', 'bullet2'];
var randomEnemyAttack = Math.floor(Math.random()*enemyattacks.length);

var gameTitle = {
  preload: function() {
    game.load.image('starfield', 'assets/images/space.jpg'); //this loads images. first arg is key name, second arg is path to image
    game.load.image('mainscreen', 'assets/images/Starfortinvaders.jpg'); //this loads images. first arg is key name, second arg is path to image
    game.load.image('STI', 'assets/images/starfortlogo.png'); //this loads images. first arg is key name, second arg is path to image
    game.load.image('xboxa', 'assets/images/XBOXA.png'); //this loads images. first arg is key name, second arg is path to image
    game.load.audio('playgamemusic', 'assets/audio/SF.mp3');
  },

  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    playgamemusic = game.add.audio('playgamemusic');
    playgamemusic.play();
    starfield = game.add.tileSprite(0, 0, 1530, 860, 'starfield'); //to load the background image into the main game, you have to create a new sprite for each image. this.game always refer to the MAIN GAME object. sprite() takes x, y coordinates and key of image object you want to place the image as arguments
    mainscreen = game.add.image(320,230, 'STI'); //to load the background image into the main game, you have to create a new sprite for each image. this.game always refer to the MAIN GAME object. sprite() takes x, y coordinates and key of image object you want to place the image as arguments
    continuegame = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    stateText = game.add.text(game.world.centerX-60,game.world.centerY+157,' ', { font: '25px Helvetica ', fill: 'white' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.text= "PRESS ";
    stateText.visible = true;
    xboxa = game.add.image(game.world.centerX-10, game.world.centerY+120, 'xboxa');
  },

  update: function() {
    starfield.tilePosition.y += 2; //this scrolls ur background horizontally
    // stateText.text= "WELCOME";
    // stateText.visible = true;
    continuegame.onDown.addOnce(playy, this);

    function playy() {
      this.game.state.start("readysetgo");
    }
  }
};

var readysetgo = {
  preload: function() {
    name = prompt("Please Enter Your Name")
    game.load.image('controller', 'assets/images/controller.png');
    game.load.image('starfield', 'assets/images/space.jpg'); //this loads images. first arg is key name, second arg is path to image
    game.load.image('xboxa', 'assets/images/XBOXA.png'); //this loads images. first arg is key name, second arg is path to image
    // game.load.image('mainscreen', 'assets/images/Starfortinvaders.jpg'); //this loads images. first arg is key name, second arg is path to image
  },

  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    mainscreen = game.add.image(320,230, 'STI'); //to load the background image into the main game, you have to create a new sprite for each image. this.game always refer to the MAIN GAME object. sprite() takes x, y coordinates and key of image object you want to place the image as arguments
    starfield = game.add.tileSprite(0, 0, 1530, 860, 'starfield'); //to load the background image into the main game, you have to create a new sprite for each image. this.game always refer to the MAIN GAME object. sprite() takes x, y coordinates and key of image object you want to place the image as arguments
    continuegame = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    controller = game.add.image(450, -10, 'controller');

    // stateText = game.add.text(game.world.centerX,game.world.centerY-100,' ', { font: '84px Helvetica ', fill: 'yellow' });
    // stateText.anchor.setTo(0.5, 0.5);
    // stateText.text= "ARE YOU READY?";
    // stateText.visible = true;

    stateText2 = game.add.text(game.world.centerX,game.world.centerY+50,' ', { font: '25px Helvetica', fill: 'yellow' });
    stateText2.anchor.setTo(0.5, 0.5);
    stateText2.text= "   Shoot          :       Space or RT \n   Move           :       Arrow Keys or Analog Stick \n   Restart        :       Enter or A \n   Continue     :       Enter or A \n   Pause         :       ESC or Start";
    stateText2.visible = true;

    stateText = game.add.text(game.world.centerX-60,game.world.centerY+217,' ', { font: '25px Helvetica ', fill: 'white' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.text= "PRESS ";
    stateText.visible = true;
    xboxa = game.add.image(game.world.centerX-10, game.world.centerY+180, 'xboxa');

  },

  update: function() {
    starfield.tilePosition.y += 2; //this scrolls ur background horizontally
    // stateText.text= "WELCOME";
    // stateText.visible = true;
    continuegame.onDown.addOnce(playy, this);

    function playy() {
      this.game.state.start("GameState");
    }
  }
};


// ------ PRELOADING ASSETS -----
var GameState = {
  //where images, audio, and game files are loaded before starting the game. load the game assets before the game starts
  preload: function () {
    game.load.image('starfield', 'assets/images/space.jpg'); //this loads images. first arg is key name, second arg is path to image
    game.load.image('kaboom', 'assets/images/explosion.gif-c200');
    game.load.image('bullet', 'assets/images/blueball.png');
    game.load.image('bluebullet', 'assets/images/laser-multiple3.png');
    game.load.image('missile', 'assets/images/missilebullet.gif');
    game.load.image('player', 'assets/images/plane3.png');
    game.load.image('wormhole', 'assets/images/wormhole.gif');
    game.load.image('hpbar', 'assets/images/enemyship.gif');
    game.load.image('boss', 'assets/images/boss2.png');

    game.load.image('enemy', 'assets/images/enemyship2.png');
    game.load.image('enemy2', 'assets/images/enemyship5.png');
    game.load.image('enemy3', 'assets/images/enemyship8.png');
    game.load.image('enemy4', 'assets/images/enemyship9.png');
    game.load.image('enemy5', 'assets/images/enemyship10.png');
    game.load.image('enemy6', 'assets/images/enemyship11.png');
    game.load.image('enemy7', 'assets/images/enemyship14.png');
    game.load.image('enemy8', 'assets/images/enemyship16.png');

    game.load.image('rank', 'assets/images/rank.png');
    game.load.image('help', 'assets/images/help2.png');
    game.load.image('playpause', 'assets/images/playpause.png');
    game.load.image('home', 'assets/images/home.png');

    game.load.image('enemyBullet', 'assets/images/enemyball.gif');
    game.load.image('greenball', '/assets/images/greenball.png');
    game.load.image('redball', '/assets/images/redball.png');
    game.load.image('purpleball', '/assets/images/purpleball.png');
    game.load.image('yellowball', '/assets/images/yellowball2.png');
    game.load.image('wormholeBullet', '/assets/images/wormhole2.png');
    game.load.image('spikyball', '/assets/images/spikyball.png');
    game.load.image('bullet2', '/assets/images/bullet2.png');

    game.load.image('meteor', 'assets/images/bossBullet.png');
    game.load.image('meteor2', 'assets/images/meteor1.png');
    game.load.image('meteor3', 'assets/images/meteor2.png');
    game.load.image('meteor4', 'assets/images/meteor3.png');
    game.load.image('meteor5', 'assets/images/meteor4.png');
    game.load.image('meteor6', 'assets/images/nokia3.png');

    game.load.audio('kiblastsound', 'assets/audio/kiblast2.mp3');
    game.load.audio('lasersound', 'assets/audio/lasercut.mp3');
    game.load.audio('missilesound', 'assets/audio/missile2.mp3');
    game.load.audio('explosionsound', 'assets/audio/explosion3.mp3');
    game.load.audio('backgroundmusic', 'assets/audio/mystic.mp3');
    game.load.audio('youwin', 'assets/audio/youwin.mp3');
    game.load.audio('gameover', 'assets/audio/gameover.mp3');
    game.load.audio('playgamemusic', 'assets/audio/SF.mp3');

  },

  // ------ CREATING GAME STATES -----
  //after loading images, audio, etc. we create the game state. executes after everything is loaded
  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    playgamemusic.stop();
    starfield = game.add.tileSprite(0, 0, 1530, 860, 'starfield'); //to load the background image into the main game, you have to create a new sprite for each image. this.game always refer to the MAIN GAME object. sprite() takes x, y coordinates and key of image object you want to place the image as arguments
    game.world.setBounds(-55, 20, 1590, 880);

    button = game.add.button(20, 85, 'rank', function() {
      window.open("https://guanwill.github.io/space-invaders-leaderboard/");
    })
    helpbutton = game.add.button(27.5, 155, 'help', function() {
      window.open("https://github.com/guanwill/space-invaders");
    })
    homebutton = game.add.button(25.5, 218, 'home', function() {
      window.location.href = "https://arcane-river-66749.herokuapp.com/";
    })

    // homebutton = game.add.button(25, 151, 'home', function() {
    //   window.location.href = "https://arcane-river-66749.herokuapp.com/";
    // })
    // helpbutton = game.add.button(27, 218, 'help', function() {
    //   window.open("https://github.com/guanwill/space-invaders");
    // })

    // Creating Pause function on ESC key
    window.onkeydown = function(event) { //27 is keycode for ESC
      if (event.keyCode == 27){
        if (game.paused = !game.paused) {
          stateText.text = "Paused";
          stateText.visible = true;
        }
        else {
          stateText.visible = false;
        }
      }
    }

    helpbutton.scale.setTo(0.7,0.7);

    //add bg music
    backgroundmusic = game.add.audio('backgroundmusic', 1, true)
    backgroundmusic.play();

    //add sound effects
    kiblastsound = game.add.audio('kiblastsound');
    lasersound = game.add.audio('lasersound');
    missilesound = game.add.audio('missilesound');
    explosionsound = game.add.audio('explosionsound');
    kiblastsound.allowMultiple = true; //lets sound overlap each other. won't cancel sound when new sound is played
    lasersound.allowMultiple = true;
    missilesound.allowMultiple = true;
    explosionsound.allowMultiple = true;
    kiblastsound.volume=0.8; //setting volume of sound
    lasersound.volume=0.4;
    missilesound.volume=0.4;
    explosionsound.volume=0.8;

    youwin = game.add.audio('youwin');
    gameover = game.add.audio('gameover');
    gameover.volume=2;
    youwin.volume=2;


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

    //add third bullet
    missile = game.add.group();
    missile.enableBody = true;
    missile.physicsBodyType = Phaser.Physics.ARCADE;
    missile.createMultiple(90, 'missile'); //FIND THE BULLET IMAGE
    missile.setAll('anchor.x', 0.5);
    missile.setAll('anchor.y', 1);
    missile.setAll('outOfBoundsKill', true);
    missile.setAll('checkWorldBounds', true);

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
    for (var y = 0; y < 5; y++){ //how many rows of enemies
          for (var x = 0; x < 9; x++){ //how many enemies per row
              // var alien = aliens.create(x * 98, y * 45, enemyships[randomNumber]); //FIND THE ENEMY IMAGE. how close the enemies are placed next to each other
              var alien = aliens.create(x * 98, y * 45, 'enemy'); //FIND THE ENEMY IMAGE. how close the enemies are placed next to each other
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
    firebluebullet = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    firemissile = game.input.keyboard.addKey(Phaser.Keyboard.W);
    continuegame = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 50, scoreString + score, { font: '24px Arial', fill: 'white' });

    //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 200, 50, 'Lives : ', { font: '24px Arial', fill: 'white' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '24px Press Start 2P', fill: 'yellow' });
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
        if (firemissile.isDown){
            firemissiles();
        }
        if (game.time.now > firingTimer){
            enemyFires();
            meteorFires();
        }

        // configuring boss bullets
        function meteorFires () {
          meteor = meteors.getFirstExists(false); //  Grab the first meteor we can from the pool
          meteor.reset(50, 50); // for meteoring purposes
          game.physics.arcade.moveToObject(meteor,player,meteorSpeed); //how fast the bullet flies and who to aim the bullet at
          firingTimer = game.time.now + 800; //how frequent the bullet fires. the lower the more
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
              game.physics.arcade.moveToObject(enemyBullet,player,bulletSpeed); //how fast the bullet flies and who to aim the bullet at
              firingTimer = game.time.now + 2; //how frequent the bullet fires. the lower the more frequent
          }
        }

        function fireBullet () {
            if (game.time.now > bulletTime){ // To avoid them being allowed to fire too fast we set a time limit
                bullet = bullets.getFirstExists(false); // Grab the first bullet we can

                if (bullet){
                  bullet.reset(player.x, player.y + -43); //and fire it.
                  bullet.body.velocity.y = -400;
                  lasersound.play();
                  bulletTime = game.time.now + 230; //how fast the bullet fires
                }
            }
        }

        function fireBullet2 () {
            if (game.time.now > bulletTime){ // To avoid them being allowed to fire too fast we set a time limit
                bullet = bullets2.getFirstExists(false); // Grab the first bullet we can from the

                if (bullet){
                  bullet.reset(player.x, player.y + -43); //and fire it.
                  bullet.body.velocity.y = -400;
                  kiblastsound.play();
                  bulletTime = game.time.now + 300; //how fast the bullet fires
                }
            }
        }

        function firemissiles() {
            if (game.time.now > bulletTime){ // To avoid them being allowed to fire too fast we set a time limit
                bullet = missile.getFirstExists(false); // Grab the first bullet we can from the

                if (bullet){
                  bullet.reset(player.x, player.y + -43); //and fire it.
                  bullet.body.velocity.y = -400;
                  missilesound.play();
                  bulletTime = game.time.now + 100; //how fast the bullet fires
                }
            }
        }

        // Run collision
        game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this); //define collisionHandler below
        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this); //define enemyhitsplayer below
        game.physics.arcade.overlap(bullets2, aliens, collisionHandler, null, this); //define collisionHandler below
        game.physics.arcade.overlap(missile, aliens, collisionHandler, null, this); //define collisionHandler below
        game.physics.arcade.overlap(meteors, player, meteorHitsPlayer, null, this); //define enemyhitsplayer below
     }

        function meteorHitsPlayer (player,bullet) {
          bullet.kill();
          live = lives.getFirstAlive();
          explosionsound.play();

          if (live){
            live.kill();
          }

          //  create an explosion
          var explosion = explosions.getFirstExists(false);
          explosion.reset(player.body.x, player.body.y);
          explosion.play('kaboom', 30, false, true);

          // When the player dies
          if (lives.countLiving() < 1){
              gameover.play();
              player.kill();
              meteors.callAll('kill');
              enemyBullets.callAll('kill');
              stateText.text= "     Gameover!\n Your score is "+ score + "!\n Hit enter or A to restart";
              stateText.visible = true;
              console.log('boo')
              continuegame.onDown.addOnce(restart, this); //addOnce is used instead of add so that this function only applies the one time when we click on 'this'.
              console.log('continue game')
              saveGameStats();
          }

          function saveGameStats () {
            $.ajax({
              url: 'https://arcane-river-66749.herokuapp.com/api',
              method: 'POST',
              data: {
                name: name,
                score: score,
              },
              datatype: 'JSON',
              success: function(data){  //if successful upon grabbing data
                console.log(data);

              }
            })
          }

          //  A new level starts
          function restart () {
              lives.callAll('revive'); //resets the life count
              aliens.removeAll();
              createAliens(); // And brings the aliens back from the dead
              player.revive(); //revives the player
              stateText.visible = false; //hides the text

              enemyBullets.removeAll();
              enemyBullets.createMultiple(90, 'enemyBullet'); //FIND THE ENEMY BULLET IMAGE

              meteors.removeAll();
              meteors.createMultiple(90, 'meteor');

              scoreString = 'Score : ';
              score = 0;
              bulletSpeed = 300;
              meteorSpeed = 350;
          }

          function createAliens () {
          for (var y = 0; y < 5; y++){ //how many rows of enemies
                for (var x = 0; x < 9; x++){ //how many enemies per row
                    var alien = aliens.create(x * 98, y * 45, 'enemy'); //FIND THE ENEMY IMAGE. how close the enemies are placed next to each other
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
          explosionsound.play();

          //  Increase the score
          score += 20;
          scoreText.text = scoreString + score;

          //  Create an explosion
          var explosion = explosions.getFirstExists(false);
          explosion.reset(alien.body.x, alien.body.y);
          explosion.play('kaboom', 30, false, true);

          if (aliens.countLiving() === 0){
              youwin.play();
              score += 1000;
              meteors.callAll('kill');
              enemyBullets.callAll('kill');
              player.kill();
              stateText.text= "       Nice!\n Your score is "+ score + "!\n Hit enter or A to continue";
              stateText.visible = true;  //show above text
              continuegame.onDown.addOnce(continuee, this);
              console.log('continue game')
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
              enemyBullets.removeAll();
              var enemyattacks = ['enemyBullet', 'greenball', 'redball', 'purpleball', 'yellowball', 'spikyball', 'wormholeBullet', 'bullet2'];
              var randomEnemyAttack = Math.floor(Math.random()*enemyattacks.length);
              enemyBullets.createMultiple(90, enemyattacks[randomEnemyAttack]); //FIND THE ENEMY BULLET IMAGE

              meteors.removeAll();
              var meteorattacks = ['meteor', 'meteor2', 'meteor3', 'meteor4', 'meteor5']
              var randomMeteorAttack = Math.floor(Math.random()*meteorattacks.length);
              meteors.createMultiple(90, meteorattacks[randomMeteorAttack]); //FIND THE METEOR IMAGE

              bulletSpeed = bulletSpeed + 50;
              meteorSpeed = meteorSpeed + 20;
          }

          function createAliens () {
          var randomNumber = Math.floor(Math.random()*enemyships.length);
          for (var y = 0; y < 5; y++){ //how many rows of enemies
                for (var x = 0; x < 9; x++){ //how many enemies per row
                    var alien = aliens.create(x * 98, y * 45, enemyships[randomNumber]); //FIND THE ENEMY IMAGE. how close the enemies are placed next to each other
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
          explosionsound.play();

          if (live){
            live.kill();
          }

          //  create an explosion
          var explosion = explosions.getFirstExists(false);
          explosion.reset(player.body.x, player.body.y);
          explosion.play('kaboom', 30, false, true);

          // When the player dies
          if (lives.countLiving() < 1){
              gameover.play();
              player.kill();
              enemyBullets.callAll('kill');
              stateText.text= "     Gameover!\n Your score is "+ score + "!\n Hit enter or A to restart";
              stateText.visible = true;
              continuegame.onDown.addOnce(restart, this); //addOnce is used instead of add so that this function only applies the one time when we click on 'this'.
              console.log('continue game')
              saveGameStats();
          }

          function saveGameStats () {
            $.ajax({
              url: 'https://arcane-river-66749.herokuapp.com/api',
              method: 'POST',
              data: {
                name: name,
                score: score,
              },
              datatype: 'JSON',
              success: function(data){  //if successful upon grabbing data
                console.log(data);

              }
            })
          }

          //  A new level starts
          function restart () {
              lives.callAll('revive'); //resets the life count
              aliens.removeAll();
              createAliens(); // And brings the aliens back from the dead
              player.revive(); //revives the player
              stateText.visible = false; //hides the text

              enemyBullets.removeAll();
              enemyBullets.createMultiple(90, 'enemyBullet'); //FIND THE ENEMY BULLET IMAGE

              meteors.removeAll();
              meteors.createMultiple(90, 'meteor');

              scoreString = 'Score : ';
              score = 0;
              bulletSpeed = 300;
              meteorSpeed = 350;
          }

          function createAliens () {
          for (var y = 0; y < 5; y++){ //how many rows of enemies
                for (var x = 0; x < 9; x++){ //how many enemies per row
                    var alien = aliens.create(x * 98, y * 45, 'enemy'); //FIND THE ENEMY IMAGE. how close the enemies are placed next to each other
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
            explosionsound.play();

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

          //---------MISSILE CREATION AND COLLISION EFFECTS---------

          function collisionHandler (missile, alien) {
            // When a bullet hits an alien we kill them both
            missile.kill();
            alien.kill();
            explosionsound.play();

            //  Create an explosion
            var explosion = explosions.getFirstExists(false);
            explosion.reset(alien.body.x, alien.body.y);
            explosion.play('kaboom', 30, false, true);

            if (aliens.countLiving() === 0){
                enemyBullets.callAll('kill',this);

            }
          }
          function enemyHitsPlayer (player,missile) {
            missile.kill();

            var explosion = explosions.getFirstExists(false);
            explosion.reset(player.body.x, player.body.y);
            explosion.play('kaboom', 30, false, true);
          }

          //---------METEOR BULLET CREATION AND COLLISION EFFECTS---------

          function collisionHandler (bullets2, alien) {
            // When a bullet hits an alien we kill them both
            bullets2.kill();
            alien.kill();
            explosionsound.play();

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
// game.state.start('GameState'); //to initiate the game by firing the state up (State is defined above)

game.state.add('GameTitle', gameTitle);
this.game.state.start("GameTitle");
game.state.add('readysetgo', readysetgo);
