// functions to move around the board
export function getCoord(position) {
    listOfCoordinates = {
        0:[735,720],
        1:[640,720],
        2:[578,720],
        3:[512,720],
        4:[444,720],
        5:[380,720],
        6:[310,720],
        7:[250,720],
        8:[183,720],
        9:[119,720],
        10:[15,720],
        
        11:[24,643],
        12:[24,580],
        13:[24,519],
        14:[24,450],
        15:[24,386],
        16:[24,321],
        17:[24,255],
        18:[24,190],
        19:[24,125],
        20:[24,40],
        
        21:[119,32],
        22:[183,32],
        23:[250,32],
        24:[310,32],
        25:[380,32],
        26:[444,32],
        27:[512,32],
        28:[578,32],
        29:[640,32],
        30:[735,32],
        
        31:[735,120],
        32:[735,190],
        33:[735,255],
        34:[735,320],
        35:[735,386],
        36:[735,450],
        37:[735,519],
        38:[735,580],
        39:[735,643]
    }
    return listOfCoordinates[position];
}

// In the future, can specify image token. 
//canvasID aka playerID
function movePlayer(canvasID, position) {
    let coordinate = getCoord(position);
    var c = document.getElementById(canvasID);
    const ctx = c.getContext('2d');
    var img = new Image();
    img.onload = function() {
        ctx.clearRect(0,0,800,800);
        ctx.beginPath();
        ctx.drawImage(img,coordinate[0], coordinate[1]);
        ctx.closePath();
    }
    imgg.src="p.png";
}

function clear(canvasID){
    var c = document.getElementById(canvasID);
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
}