//Takes in game ID and displays the game board

export function activeGame(gameID){
  //checks if a game id has been provided and then creats the canvas
  if(gameID !== null){
    const id = gameID;
    document.getElementById('content').innerHTML = '<canvas id="gameBoard" height="600" width = "600"></canvas> <img class="background" src="images/gameBoard.jpg" alt="gameBoard">';
    //loadBoard();
  }
  else{
    document.getElementByID('content').innerHTML = '<p>An error has occured with creating the game: Game ID could not be resolved<p>';
  }
}
//An elegent way to load the board (not yet working)
/*export function loadBoard(){
  var canvas = document.getElementById('gameBoard');
  var context = canvas.getContext('2d');

  // load image from data url
  var imageObj = new Image();
  imageObj.onload = function() {
  context.drawImage(this, 0, 0);
};

imageObj.src = '/images/gameBoard.jpg';
}

// make ajax call to get image data url
  var request = new XMLHttpRequest();
  request.open('GET', '/images/gameBoard.jpg', true);
  request.onreadystatechange = function() {
// Makes sure the document is ready to parse.
  if(request.readyState == 4) {
// Makes sure it's found the file.
    if(request.status == 200) {
      loadCanvas(request.responseText);
    }
    else{
      document.getElementById('content').innerHTML='<p> Error: File not found';
    }
  }
};
request.send(null);


}*/
