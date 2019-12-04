<?php /* 
    Empty Space | Sample HTML5 Web Game
*/ ?>
<html>
    <head>
        <title>Empty Space</title>
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        <link rel="stylesheet" type="text/css" href="game.css" media="all" />
        <link href="favicon.ico" rel="shortcut  icon">
    </head>
    <body>
        <div id="game-area" class="game-area">
            <canvas id="game-canvas" class="game-canvas"></canvas>
        </div>
        <div id="game-info" class="game-info">
            <h1>Empty Space</h1>
            <h2>Sample HTML5 Web Game Project</h2>
            <p>This is intended to be a simple html5 game sample to learn about the game loop, delta times, velocity, and hit testing.</p>
            <h3>How to Play</h3>
            <p>Use keyboard to move and spacebar to shoot</p>
            <h3>How it's Made</h3>
            <p>Made with JavaScript and HTML canvas</p>
            <h3>Credits</h3>
            <p>Design and development by Ben Borkowski</p>
        </div>

        <?php /* 
            simple way to load js at the end of the body 
        */ ?>
        <script src="game.js"></script>

    </body>
</html>