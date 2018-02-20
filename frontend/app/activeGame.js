//Takes in game ID and displays the game board

export function activeGame(gameID){
  //checks if a game id has been provided and then creats the canvas
  if(gameID !== null){
    const id = gameID;
    document.getElementById('content').innerHTML = '<canvas id="gameBoard" height="600" width = "600"></canvas>';
    loadBoard();
  }
  else{
    document.getElementByID('content').innerHTML = '<p>An error has occured with creating the game: Game ID could not be resolved<p>';
  }
}

function loadBoard(){
  var canvas = document.getElementById('gameBoard')
  canvas = canvas.getContext('2d')
  var img = new Image();
  img.onload = function(){
    canvas.drawimage(img , 0 , 0);
  }
  img.src = '/images/gameBoard.jpg';

}
