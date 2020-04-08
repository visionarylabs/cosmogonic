/**
    Cosmogonic
    v0.1 - 11-30-19
    Ben Borkowski - Design and Development
    screen: 256 x 240
    char: 12 x 16
**/

// main game setup vars
var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext("2d");
var w = window;

// game timing vars
//var then = Date.now();
var then = performance.now();
var modifier = 0;
var delta = 0;

// game environment vars
var gameSpeed = 1;
var friction = .95;

//game state
var score = 0;

//hero
var heroSpeed = 250; //px per second
var heroAcceleration = 20;

//bullet
var bulletSpeed = 20;
var rateOfFire = 250; //in miliseconds, 250 default = 4 every 1s
var lastFire = 0;
var canFire = true;
var lastFireSide = 'left';

//enemies
var enemySpeed = 10;
var rateOfEnemies = 1000; //rate of enemy spwan, 1000 default = every 1s
var lastEnemy = 0;

//bg
var bg = {};

// key Listeners
var keysDown = {};

addEventListener("keydown", function (e) {
    e.preventDefault();
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    e.preventDefault();
    delete keysDown[e.keyCode];
}, false);

// Cross-browser support for requestAnimationFrame
var requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

//main game sounds
var mixer = function(){
    
    var sound01 = document.createElement("audio");
    sound01.src = "sounds/sound-fire-02.mp3";
    
    var sound02 = document.createElement("audio");
    sound02.src = "sounds/sound-fire-02.mp3";
    
    var sound03 = document.createElement("audio");
    sound03.src = "sounds/sound-fire-03.mp3";
    
    var sound04 = document.createElement("audio");
    sound04.src = "sounds/sound-hit-01.mp3";
    
    var sound05 = document.createElement("audio");
    sound05.src = "sounds/sound-explode-01.mp3";
    
    var playSound01 = function(){
        sound01.play();
    }
    var playSound02 = function(){
        sound02.play();
    }
    var playSound03 = function(){
        sound03.play();
    }
    var playSound04 = function(){
        sound04.play();
    }
    var playSound05 = function(){
        sound05.play();
    }
    
    return{
        playSound01 : playSound01,
        playSound02 : playSound02,
        playSound03 : playSound03,
        playSound04 : playSound04,
        playSound05 : playSound05,
    }
}();

// main game sprites
var hero = {
    x : 0,
    y : 0,
    velx : 0,
    vely : 0,
    width : 31,
    height : 31,
    speed : heroSpeed,
    acceleration : heroAcceleration,
    destroy : false,
    image : null,
};

var bullets = [];
var enemies = [];

var makeBullet = function(type,x,y,velx,vely){
    var bullet = {
        type : type,
        x : x,
        y : y,
        velx : velx,
        vely : vely,
        width : 4,
        height : 4,
        speed : bulletSpeed,
        destroy : false,
    }
    return bullet;
};

var makeEnemy = function(){
    var enemy = {
        x : 0,
        y : 50,
        velx : 20,
        vely : 0,
        width : 31,
        height : 21,
        speed : enemySpeed,
        destroy : false,
        image : null,
    }
    enemy.image = new Image();
    enemy.image.src = './images/enemy-ship-01.png';
    return enemy;
};

var fireBullet = function(){
    var bulletOffest = 5;
    if(canFire == false) return;
    //fire side of ship
    if(lastFireSide == 'left'){
        bulletOffest = 5;
        lastFireSide = 'right';
    }else if(lastFireSide == 'right'){
        bulletOffest = hero.width - 5;
        lastFireSide = 'left';
    }
    var temp = makeBullet('hero',hero.x + bulletOffest, hero.y,0,-20);
    bullets.push(temp);
    canFire = false;
    lastFire = performance.now();
    mixer.playSound03();
}

var enemyFireBullet = function(enemy){
    var temp = makeBullet('enemy', enemy.x + enemy.width/2 - 2, enemy.y + enemy.height, 0, 10);
    bullets.push(temp);
    mixer.playSound02();
}

//start the game to play
var init = function(){
    canvas.width = 800;
    canvas.height = 600;
    canvas.id = 'game-canvas';
    
    //load graphics
    hero.image = new Image();
    hero.image.src = './images/hero-ship-01.png';
    bg.image = new Image();
    bg.image.src = './images/cosmogonic-bg.jpg';
    
    //console.log('hero');
    //console.log(hero);
    
    resetGame();
    mainLoop();
};

//reset the game for start and reset
var resetGame = function () {
    //console.log('resetGame');
    hero.x = canvas.width / 2 - (hero.width / 2);
    hero.y = canvas.height - (hero.height * 2);
    hero.destroy = false;
    bullets = [];
    enemies = [];
    lastEnemy = 0;
    lastFire = 0;
    canFire = true;
    score = 0;
};

// Check inputs for how to update sprites
var update = function (modifier) {
    
    //check keys down
    
    // Player holding space
    if (32 in keysDown ) {
        fireBullet();
    }

    // Player holding left
    if (37 in keysDown) {
        if (hero.velx > -hero.speed) {
            hero.velx -= hero.acceleration;
        }
    }
    // Player holding right
    if (39 in keysDown) {
        if (hero.velx < hero.speed) {
            hero.velx += hero.acceleration;
        }
    }

    // slow down / stop the hero
    hero.velx = hero.velx * friction;

    if( hero.velx < 1 && hero.velx > -1 ){
        hero.velx = 0;
    }
    if( hero.velx > hero.speed ){
        hero.velx = hero.speed;
    }
    if( hero.velx < -hero.speed ){
        hero.velx = -hero.speed;
    }

    // move the hero
    // -------------
    hero.x += hero.velx * modifier * gameSpeed;
    // -------------

    // stop hero on screen edge
    if (hero.x >= canvas.width - hero.width) {
        hero.x = canvas.width - hero.width;
        hero.velx = 0;
    }else if (hero.x <= 0) {
        hero.x = 0;
        hero.velx = 0;
    }
    
    // set rate of fire
    if( canFire = false == false && performance.now() - lastFire >= rateOfFire ){
        canFire = true;
    }
    
    // make enemies
    if( lastEnemy < performance.now() - rateOfEnemies ){
        var enemy = makeEnemy();
        enemies.push(enemy);
        lastEnemy = performance.now();
    }

    //Bullet and Ship Loops
    var bulletMoveNum;
    var enemyCheckNum;
    var bulletCheckNum;

    // move bullets
    for(bulletMoveNum = bullets.length - 1; bulletMoveNum >= 0; bulletMoveNum--){
        bullets[bulletMoveNum].y += bullets[bulletMoveNum].vely * bullets[bulletMoveNum].speed * modifier * gameSpeed;
        //destroy bullets off the edge
        if(bullets[bulletMoveNum].y < 0){
            bullets.splice(bulletMoveNum,1);
        }
    }
    
    // move enemies
    if(enemies.length <= 0) return;
    
    for(enemyCheckNum = enemies.length - 1; enemyCheckNum >= 0; enemyCheckNum--){
        //move enemies
        enemies[enemyCheckNum].x += enemies[enemyCheckNum].velx * enemies[enemyCheckNum].speed * modifier * gameSpeed;
        
        //enemy fire
        if( ( Math.floor(Math.random() * 100) + 1 ) >= 98 ){
            enemyFireBullet(enemies[enemyCheckNum]);
        }
        
        //destroy enemies off the edge
        if(enemies[enemyCheckNum].x > canvas.width){
            enemies[enemyCheckNum].destroy = true;
            continue;
        }

        if(bullets.length <= 0) continue;

        //check bullets
        for(bulletCheckNum = bullets.length - 1; bulletCheckNum >= 0; bulletCheckNum--){
            //collisions
            if(bullets[bulletCheckNum].type == 'hero'){
                if( bullets[bulletCheckNum].x > enemies[enemyCheckNum].x &&
                    bullets[bulletCheckNum].x < enemies[enemyCheckNum].x + enemies[enemyCheckNum].width &&
                    bullets[bulletCheckNum].y > enemies[enemyCheckNum].y &&
                    bullets[bulletCheckNum].y < enemies[enemyCheckNum].y + enemies[enemyCheckNum].height
                ){
                    enemies[enemyCheckNum].destroy = true;
                    bullets[bulletCheckNum].destroy = true;
                    score++;
                    mixer.playSound04();
                }
            }
        }
    }
    
    //check enemy bullets
    for(bulletCheckNum = bullets.length - 1; bulletCheckNum >= 0; bulletCheckNum--){
        //collisions
        if(bullets[bulletCheckNum].type == 'enemy'){
            if( bullets[bulletCheckNum].x > hero.x &&
                bullets[bulletCheckNum].x < hero.x + hero.width &&
                bullets[bulletCheckNum].y > hero.y &&
                bullets[bulletCheckNum].y < hero.y + hero.height
            ){
                hero.destroy = true;
                bullets[bulletCheckNum].destroy = true;
                mixer.playSound05();
            }
        }
    }

    if(hero.destroy == true){
        //console.log('you lose!');
        resetGame();
        return;
    }
    
    //clean arrays
    for(bulletCheckNum = bullets.length - 1; bulletCheckNum >= 0; bulletCheckNum--){
        if(bullets[bulletCheckNum].destroy == true){
            bullets.splice(bulletCheckNum,1);
        }
    }
    for(enemyCheckNum = enemies.length - 1; enemyCheckNum >= 0; enemyCheckNum--){
        if(enemies[enemyCheckNum].destroy == true){
            enemies.splice(enemyCheckNum,1);
        }
    }

};

// Draw everything
var render = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showBg();
    showText();
    showSprites();
};

// game sprites
var showSprites = function(){

    if(hero.image.src){
        ctx.drawImage( hero.image, hero.x, hero.y, hero.width, hero.height );
    }else{
        //draw hero at x, y, w, h
        ctx.fillStyle       = "rgb(150,150,150)";
        ctx.fillRect(hero.x, hero.y, hero.width, hero.height);
    }

    //draw bullets
    ctx.fillStyle       = "rgb(200,200,200)";
    for(i=0;i<bullets.length;i++){
        if(bullets[i].type == 'hero'){
            ctx.fillStyle       = "rgb(100,200,100)";
            ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
        }else if(bullets[i].type == 'enemy'){
            ctx.fillStyle       = "rgb(255,100,100)";
            ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
        }
    }
    
    //draw enemies
    ctx.fillStyle       = "rgb(150,50,50)";
    for(i=0;i<enemies.length;i++){
        if(enemies[i].image.src){
            ctx.drawImage( enemies[i].image, enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height );
        }else{
            ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
        }
    }
    
};

// game ui
var showText = function(){
    ctx.fillStyle       = "white";
    ctx.font            = "normal 11pt Verdana";
    ctx.fillText("Cosmogonic", 10, 26);
    ctx.fillText('Score: ' + score, 10, 56);
    //debug
    ctx.fillText('modifier: ' + Math.ceil(modifier * 1000), 10, 76);
    ctx.fillText('speed: ' + hero.speed, 10, 96);
    ctx.fillText('velocity: ' + Math.ceil(hero.velx), 10, 116);
};

// game ui
var showBg = function(){
    if(bg.image.src){
        ctx.drawImage( bg.image, 0, 0, canvas.width, canvas.height );
    }
};

// The main game loop
var mainLoop = function () {
    var now = performance.now();
    delta = now - then;
    modifier = delta / 1000; //modifier in seconds

    update(modifier);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(mainLoop);
};

// Let's play this game!
init();