//Takes in game ID and displays the game board

export function activeGame(gameID){
  if(gameID !== null){
    const id = gameID;
    
  }
  else{
    document.getElementByID('content').innerHTML = '<p>An error has occured with creating the game: Game ID could not be resolved<p>'
  }
}
