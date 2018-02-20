//Takes in game ID and displays the game board

export function loadCanvas(gameID){
  //checks if a game id has been provided and then creats the canvas
  if(gameID !== null){
    const id = gameID;
    document.getElementById('content').innerHTML = '<canvas id="gameBoard" height="800" width = "800" style="z-index : 0"></canvas>';
    document.getElementByID('content').append('<canvas id="player1" height="800" width = "800" style="z-index :1"></canvas>');
    document.getElementByID('content').append('<canvas id="player2" height="800" width = "800" style="z-index :2"></canvas>');
    document.getElementByID('content').append('<canvas id="player3" height="800" width = "800" style="z-index :3"></canvas>');
    document.getElementByID('content').append('<canvas id="player4" height="800" width = "800" style="z-index :4"></canvas>');
    document.getElementByID('content').append('<canvas id="game-info" height="800" width = "800" style="z-index :5"></canvas>');
    loadBoard();
  }

  else{
    document.getElementByID('content').innerHTML = '<p>An error has occured with creating the game: Game ID could not be resolved<p>';
  }
}

function loadBoard(){
  var canvas = document.getElementById('gameBoard')
  ctx = canvas.getContext('2d')
  var img = new Image();
  img.onload = function(){
    ctx.drawImage(img , 0 , 0);
  }
  img.src = '/images/monopoly.jpeg';

}
