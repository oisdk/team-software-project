export function requestGameList(){
	
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		
		//just an example for testing to simulate this.responseText
		list = JSON.stringify(['game1','game2','game3','game4']);
		pickGame(list);
	    
    }
  };
  xhttp.open("POST", "get_games.py", true);
  xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhttp.send();
}

export function pickGame(list){
	
	// generate the nodes vs changing innerHTML of an empty div ? 
	var ul = document.createElement('ul');
	list = JSON.parse(list);
	for( i in list){
		var li = document.createElement('li');
		var item = document.createTextNode(list[i]);
		li.appendChild(item);
		ul.appendChild(li);
		document.body.appendChild(ul);
	}
}