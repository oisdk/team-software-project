//Takes in game ID and displays the game board

export function loadCanvas(gameID){
  //checks if a game id has been provided and then creats the canvas
  if(gameID !== null){
    const id = gameID;
    document.getElementById('content').innerHTML = '<canvas id="gameBoard" height="600" width = "602"></canvas>';
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
  img.src = 'http://weclipart.com/gimg/E934D7AB9F40FD25/monopoly-board-game-template-wallpaper-game-gallery-clipart.jpeg';

}
