<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>2048 - MultiMultiplayer</title>
  <!-- Game CSS -->
  <link href="style/main.css" rel="stylesheet" type="text/css">
</head>
<body>
  <div class="container">
    <div class="heading">
      <h1 class="title">2048 - MultiMultiplayer</h1></br>
      <div id="game-stats" style="display:none; float:right">
        <h5 id="num-players" style="margin: 0">Active players: </h5>
        <h5 id="num-games" style="margin: 0">Active games: </h5>
      </div>
    </div>
    <p class="game-intro">Join the numbers and get to the <strong>2048 tile!</strong> Your square is on the left!</p>
    <div class="scores">
      <div class="score-container" style="float: left">0</div>
      <div class="" style="margin-top: 15px; position: absolute; left: 50%">
        <div style="position: relative; left: -50%">
          <p id="player-msg" style="width: 230px; height: 30px">
            <a id="game-start-btn" class="btn">Find a Competitor!</a>
          </p>
        </div>
      </div>
      <div class="score-container" style="float: right">0</div>
    </div>
    <div class="game-boards">
      <?php
        $players = array("local","online");
        foreach($players as $player){
          echo '<div id="player-' . $player . '" style="display:inline-block; float:left;">';
          echo '<div class="game-container">';
          echo '<div class="game-message"><p></p></div>';
          echo '<div class="grid-container">';
          for($i = 1; $i < 5; $i++ ){
            echo '<div class="grid-row">';
            for($j = 1; $j < 5; $j++){
              echo '<div class="grid-cell"></div>';
            }
            echo '</div>';
          }
          echo '<div class="tile-container"></div>';
          echo '</div></div></div>';
        }
      ?>
    <p class="game-explanation">
      <strong class="important">How to play:</strong> Use your <strong>arrow keys</strong> to move the tiles. When two tiles with the same number touch, they <strong>merge into one!</strong>
    </p>
    <hr>
    <p>
     Created by <a href="http://gabrielecirulli.com" target="_blank">Gabriele Cirulli.</a> Based on <a href="https://itunes.apple.com/us/app/1024!/id823499224" target="_blank">1024 by Veewo Studio.</a>  Multiplayer added by <a href="http://stolarsky.com" target="_blank">Emil Stolarsky.</a> 
    </p>
  </div>
  <!-- Libraries JS -->
  <script src="libs/jquery-2.1.0/jquery.min.js"></script>
  <script src="http://cdn.sockjs.org/sockjs-0.3.min.js"></script>
  <script src="http://cdn.sockjs.org/websocket-multiplex-0.1.js"></script>

  <!-- Game JS -->
  <script src="js/online_input_manager.js"></script>
  <script src="js/keyboard_input_manager.js"></script>
  <script src="js/html_actuator.js"></script>
  <script src="js/grid.js"></script>
  <script src="js/tile.js"></script>
  <script src="js/game_manager.js"></script>
  <script src="js/application.js"></script>
</body>
</html>
