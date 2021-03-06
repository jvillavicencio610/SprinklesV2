
var game = new Phaser.Game(256, 240, Phaser.CANVAS, '', {
  preload: preload,
  create: create,
  update: update
}, false, false);

var score = 0;
    var scoreString = '';
    var scoreText;
var sprite;
var text;

function preload() {
  game.load.spritesheet('tiles', 'https://res.cloudinary.com/harsay/image/upload/v1464614984/tiles_dctsfk.png', 16, 16);
  game.load.spritesheet('goomba', 'assets/Enemy.png', 24, 24);
  game.load.spritesheet('mario', 'assets/happy dino.png', 24, 24);
  game.load.spritesheet('coin', 'assets/leaf.png', 20, 20);

  game.load.tilemap('level', 'https://api.myjson.com/bins/3kk2g', null, Phaser.Tilemap.TILED_JSON);
    
    

//    scoreString = 'Score : ';
//    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });
    //Created a Sprite with fixedToCamera = true
    sprite = game.add.sprite(0,0);
    sprite.fixedToCamera = true;//addChild of my text at x:0, y:0
    text = game.add.text(0,0,"Score: 0");
    sprite.addChild(text);//position the cameraOffset of my Sprite
    sprite.cameraOffset.x = 20;
    sprite.cameraOffset.y = 20;
}

function create() {
  Phaser.Canvas.setImageRenderingCrisp(game.canvas)
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.physics.startSystem(Phaser.Physics.ARCADE);
   
  game.stage.backgroundColor = '#5c94fc';

  map = game.add.tilemap('level');
  map.addTilesetImage('tiles', 'tiles');
  map.setCollisionBetween(3, 12, true, 'solid');

  map.createLayer('background');

  layer = map.createLayer('solid');
  layer.resizeWorld();

    
  coins = game.add.group();
  coins.enableBody = true;
  map.createFromTiles(2, null, 'coin', 'stuff', coins);
  coins.callAll('animations.add', 'animations', 'spin', [0], 3, true);
  coins.callAll('animations.play', 'animations', 'spin');
    
  goombas = game.add.group();
  goombas.enableBody = true;
  map.createFromTiles(1, null, 'goomba', 'stuff', goombas);
   // goombas.animations.add('right', [0, 1, 2, 3], 10, true);
   //  goombas.animations.add('left', [4, 5, 6, 7], 10, true);
  goombas.callAll('animations.add', 'animations', 'goombaWalkRight', [0, 1, 2, 3], 6, true);
  goombas.callAll('animations.add', 'animations', 'goombaWalkLeft', [4, 5, 6, 7], 6, true);
// goombas.callAll('animations.play', 'animations', 'goombaWalkLeft');
  goombas.callAll('play', null, 'goombaWalkLeft');
  goombas.setAll('body.bounce.x', 1);
  goombas.setAll('body.velocity.x', -20);
  goombas.setAll('body.gravity.y', 500);

  player = game.add.sprite(16, game.world.height - 48, 'mario');
  game.physics.arcade.enable(player);
  player.body.gravity.y = 370;
  player.body.collideWorldBounds = true;
  player.animations.add('walkRight', [0, 1, 2, 3], 4, true);
  player.animations.add('walkLeft', [4, 5, 6, 7], 4, true);
  player.goesRight = true;

  game.camera.follow(player);

  cursors = game.input.keyboard.createCursorKeys();

  scoreString = 'Score : ';
  scoreText = game.add.text(10, 10, scoreString + score, { font: '12px Arial', fill: '#fff' });

}

function update() {

  game.physics.arcade.collide(player, layer);
  game.physics.arcade.collide(goombas, layer);
    game.physics.arcade.collide(goombas, 'tiles', changedirection, null, this);
  game.physics.arcade.overlap(player, goombas, goombaOverlap);
  game.physics.arcade.overlap(player, coins, coinOverlap);
    
    
    

  if (player.body.enable) {
    player.body.velocity.x = 0;
    if (cursors.left.isDown) {
      player.body.velocity.x = -90;
      player.animations.play('walkLeft');
      player.goesRight = false;
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 90;
      player.animations.play('walkRight');
      player.goesRight = true;
    } else {
      player.animations.stop();
      if (player.goesRight) player.frame = 0;
      else player.frame = 7;
    }

    if (cursors.up.isDown && player.body.onFloor()) {
      player.body.velocity.y = -190;
      player.animations.stop();
    }

    if (player.body.velocity.y != 0) {
      if (player.goesRight) player.frame = 0;
      else player.frame = 4;
    }
  }
}

function coinOverlap(player, coin) {

     score += 1;
    text.text = "Score: " + score;
    coin.kill();

    
}

function changedirection(tiles, goombas){
    goombas.callAll('play', null,'goombaWalkRight');
}

function goombaOverlap(player, goomba) {
  if (player.body.touching.down) {
    goomba.animations.stop();
    goomba.frame = 2;
    goomba.body.enable = false;
    player.body.velocity.y = -80;
    game.time.events.add(Phaser.Timer.SECOND, function() {
      goomba.kill();
    });
  } else {
    player.frame = 6;
    player.body.enable = false;
    player.animations.stop();
    game.time.events.add(Phaser.Timer.SECOND * 3, function() {
      game.paused = true;
        //need to add "game over" text
        player.kill();
        
    });
  }
}