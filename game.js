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
var heroSpeed = 250; //px per second
var heroAcceleration = 20;
var friction = .95;

// key Listeners
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
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
            //shooting
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

};

// Draw everything
var render = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showText();
    showSprites();
};

// game ui
var showText = function(){
    ctx.fillStyle       = "white";
    ctx.font            = "normal 11pt Verdana";
    ctx.fillText("Empty Space", 10, 26);
    //debug
    ctx.fillText('modifier: ' + modifier, 10, 56);
    ctx.fillText('speed: ' + hero.speed, 10, 76);
    ctx.fillText('velocity: ' + hero.velx, 10, 96);
};

// game sprites
var showSprites = function(){
    ctx.fillStyle       = "rgb(50,50,50)";
    //draw at x, y, w, h
    ctx.fillRect(hero.x, hero.y, hero.width, hero.height);
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