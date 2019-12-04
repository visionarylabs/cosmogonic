/**
    EMPTY SPACE
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
var bulletAcceleration = 20;
var rateOfFire = 250; //in miliseconds
var lastFire = 0;
var canFire = true;

//enemies
var enemySpeed = 10;
var rateOfEnemies = 1000;
var lastEnemy = 0;

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

// main game sprites
var hero = {
    x : 0,
    y : 0,
    velx : 0,
    vely : 0,
    width : 20,
    height : 30,
    speed : heroSpeed,
    acceleration : heroAcceleration
};

var bullets = [];

var enemies = [];

var makeBullet = function(x,y){
    var bullet = {
        x : x + hero.width/2 - 2,
        y : y,
        velx : 0,
        vely : -20,
        width : 4,
        height : 4,
        speed : bulletSpeed,
        acceleration : bulletAcceleration
    }
    return bullet;
};

var makeEnemy = function(){
    var enemy = {
        x : 0,
        y : 50,
        velx : 20,
        vely : 0,
        width : 20,
        height : 20,
        speed : enemySpeed,
    }
    return enemy;
};

var fireBullet = function(){
    if(canFire == false) return;
    var temp = makeBullet(hero.x, hero.y);
    bullets.push(temp);
    canFire = false;
    lastFire = performance.now();
}

//start the game to play
var init = function(){
    canvas.width = 800;
    canvas.height = 600;
    canvas.id = 'game-canvas';
    resetGame();
    mainLoop();
};

//reset the game for start and reset
var resetGame = function () {
    hero.x = canvas.width / 2 - (hero.width / 2);
    hero.y = canvas.height - (hero.height * 2);
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
    
    // move bullets
    for(var i=bullets.length -1;i >= 0; i--){
        bullets[i].y += bullets[i].vely * bullets[i].speed * modifier * gameSpeed;
        //destory bullets off the edge
        if(bullets[i].y < 0){
            bullets.splice(i,1);
        }
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
    
    // move enemies
    for(var i=enemies.length - 1; i >= 0; i--){
        //move enemies
        enemies[i].x += enemies[i].velx * enemies[i].speed * modifier * gameSpeed;
        
        //destory enemies off the edge
        if(enemies[i].x > canvas.width){
            enemies.splice(i,1);
        }

        //check bullets
        for(var j=bullets.length -1;j >= 0; j--){
            //collisions
            if( bullets[j].x > enemies[i].x &&
                bullets[j].x < enemies[i].x + enemies[i].width &&
                bullets[j].y > enemies[i].y &&
                bullets[j].y < enemies[i].y + enemies[i].height
            ){
                enemies.splice(i,1);
                bullets.splice(j,1);
                score++;
            }
        }
    }

};

// Draw everything
var render = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showText();
    showSprites();
};

// game sprites
var showSprites = function(){
    ctx.fillStyle       = "rgb(50,50,50)";

    //draw hero at x, y, w, h
    ctx.fillRect(hero.x, hero.y, hero.width, hero.height);

    //draw bullets
    for(i=0;i<bullets.length;i++){
        ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
    }
    
    //draw enemies
    ctx.fillStyle       = "rgb(100,50,50)";
    for(i=0;i<enemies.length;i++){
        ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
    }
    
};

// game ui
var showText = function(){
    ctx.fillStyle       = "white";
    ctx.font            = "normal 11pt Verdana";
    ctx.fillText("Empty Space", 10, 26);
    ctx.fillText('Score: ' + score, 10, 56);
    //debug
    //ctx.fillText('modifier: ' + modifier, 10, 76);
    //ctx.fillText('speed: ' + hero.speed, 10, 96);
    //ctx.fillText('velocity: ' + hero.velx, 10, 116);
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