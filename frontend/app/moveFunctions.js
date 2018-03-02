/**
 * A function that gets the coordinates of a position.
 *
 * @param {number} position - position on the board.
 */
export function getCoord(position) {
    const listOfCoordinates = {
        0: [735, 730],
        1: [635, 730],
        2: [570, 730],
        3: [506, 730],
        4: [440, 730],
        5: [375, 730],
        6: [310, 730],
        7: [245, 730],
        8: [180, 730],
        9: [114, 730],

        10: [12, 754],
        11: [18, 637],
        12: [18, 575],
        13: [18, 510],
        14: [18, 445],
        15: [18, 382],
        16: [18, 316],
        17: [18, 250],
        18: [18, 185],
        19: [18, 120],
        20: [20, 40],

        21: [113, 24],
        22: [179, 24],
        23: [243, 24],
        24: [308, 24],
        25: [374, 24],
        26: [439, 24],
        27: [505, 24],
        28: [570, 24],
        29: [634, 24],
        30: [735, 24],

        31: [735, 115],
        32: [735, 182],
        33: [735, 247],
        34: [735, 312],
        35: [735, 378],
        36: [735, 443],
        37: [735, 510],
        38: [735, 575],
        39: [735, 640],
        jail: [45, 710],
    };
    return listOfCoordinates[position];
}

/**
 * A function that moves a player to a given position.
 *
 * @param {string} canvasID - id of canvas to move.
 * @param {number} position - position to move player to.
 * @param {string} ImageSource - name of image to draw.
 */
// Takes in canvasID aka playerID, position on board, and a dictionary
// to decide which character corresponds to each player.
export function movePlayer(canvasID, position, ImageSource) {
    const coordinate = getCoord(position);
    const c = document.getElementById(canvasID);
    const ctx = c.getContext('2d');
    const img = new Image();
    img.onload = () => {
        ctx.clearRect(0, 0, 800, 800);
        ctx.beginPath();
        ctx.drawImage(img, coordinate[0], coordinate[1]);
        ctx.closePath();
    };
    img.src = ImageSource;
}

/**
 * A function which gets the x and y coordinates of a click event.
 *
 * @param {event} - mouse click.
 */
// useful for find x and y coordinates.
// To use add onclick="showCoords(event)" to top layer of canvas.
export function showCoords(event) {
    const x = event.clientX;
    const y = event.clientY;
    const coords = `X coords: ${x}, Y coords: ${y}`;
    console.log(coords);
}
