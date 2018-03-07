/**
 * A function that gets the hotel coordinates of each property.
 *
 * @param {number} position - Position on the board.
 * @returns {Array} - Coordinates of the parameter position.
 */
export function getHotelCoord(position) {
    const hotelCoordinates = {
        1: [647, 683],
        3: [518, 683],
        6: [322, 683],
        8: [190, 683],
        9: [122, 683],

        11: [79, 645],
        13: [79, 515],
        14: [79, 450],
        16: [79, 315],
        18: [79, 180],
        19: [79, 120],

        21: [121, 69],
        23: [255, 69],
        24: [320, 69],
        26: [450, 69],
        27: [517, 69],
        29: [648, 69],

        31: [690, 115],
        32: [690, 183],
        34: [690, 316],
        37: [690, 515],
        39: [690, 645],
    };
    if (!(position in hotelCoordinates)) {
        return 'Not a valid number';
    }
    return hotelCoordinates[position];
}

/**
 * A function that gets the house coordinates of each property and house location.
 * position finds the property location on the board, houseNumber determines the
 * location within that property position to display the corresponding houses.
 *
 * @param {number} position - Position on the board.
 * @param {number} houseNumber - number of house on the board.
 * @returns {Array} - Coordinates of the parameter position.
 */
export function getHouseCoord(position, houseNumber) {
    const houseCoordinates = {
        1: {
            1: [678, 686],
            2: [661, 686],
            3: [644, 686],
            4: [626, 686],
        },

        3: {
            1: [547, 686],
            2: [529, 686],
            3: [512, 686],
            4: [494, 686],
        },

        6: {
            1: [350, 686],
            2: [333, 686],
            3: [315, 686],
            4: [298, 686],
        },

        8: {
            1: [220, 686],
            2: [204, 686],
            3: [187, 686],
            4: [171, 686],
        },

        9: {
            56: [152, 686],
            57: [136, 686],
            58: [120, 686],
            59: [103, 686],
        },

        11: {
            1: [85, 675],
            2: [85, 660],
            3: [85, 642],
            4: [85, 625],
        },

        13: {
            1: [85, 542],
            2: [85, 527],
            3: [85, 512],
            4: [85, 495],
        },

        14: {
            1: [85, 475],
            2: [85, 460],
            3: [85, 445],
            4: [85, 430],
        },

        16: {
            1: [85, 345],
            2: [85, 330],
            3: [85, 315],
            4: [85, 300],
        },

        18: {
            1: [85, 215],
            2: [85, 200],
            3: [85, 185],
            4: [85, 170],
        },

        19: {
            1: [85, 145],
            2: [85, 130],
            3: [85, 115],
            4: [85, 100],
        },

        21: {
            1: [103, 82],
            2: [120, 82],
            3: [136, 82],
            4: [152, 82],
        },

        23: {
            1: [232, 82],
            2: [248, 82],
            3: [265, 82],
            4: [282, 82],
        },

        24: {
            1: [298, 82],
            2: [315, 82],
            3: [333, 82],
            4: [350, 82],
        },

        26: {
            1: [425, 82],
            2: [442, 82],
            3: [460, 82],
            4: [478, 82],
        },

        27: {
            1: [494, 82],
            2: [512, 82],
            3: [529, 82],
            4: [547, 82],
        },

        29: {
            1: [626, 82],
            2: [644, 82],
            3: [661, 82],
            4: [678, 82],
        },

        31: {
            1: [695, 100],
            2: [695, 115],
            3: [695, 130],
            4: [695, 145],
        },

        32: {
            1: [695, 170],
            2: [695, 185],
            3: [695, 200],
            4: [695, 215],
        },

        34: {
            1: [695, 300],
            2: [695, 315],
            3: [695, 330],
            4: [695, 345],
        },

        37: {
            1: [695, 495],
            2: [695, 512],
            3: [695, 527],
            4: [695, 542],
        },

        39: {
            1: [695, 625],
            2: [695, 642],
            3: [695, 660],
            4: [695, 675],
        },
    };
    if (!(position in houseCoordinates)) {
        return 'Not a valid number';
    }
    return houseCoordinates[position][houseNumber];
}

/**
 * A function that displays a hotel in a specfic position.
 * This function draws on the buildingLayer canvas.
 *
 * @param {number} position - Position on the board.
 */
export function displayHotel(position) {
    const coordinate = getHotelCoord(position);
    // change id when canvas is added to activeGame.
    const c = document.getElementById('buildingLayer');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.onload = () => {
        // ctx.clearRect(0, 0, 800, 800);
        ctx.beginPath();
        ctx.drawImage(img, coordinate[0], coordinate[1]);
        ctx.closePath();
    };
    img.src = 'hotel.png';
}

/**
 * A function that displays houses in a specfic position.
 *
 * @param {number} position - Position on the board.
 * @param {number} numberOfHouses - number of houses to draw on specfic position.
 */
// should only take valid property numbers
// 1,3,6,8,9,11,13,14,16,18,19,21,23,24,26,27,29,31,32,34,37,39
export function displayHouses(position, numberOfHouses) {
    console.log('building');
    const c = document.getElementById('buildingLayer');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.onload = () => {
        // ctx.clearRect(0, 0, 800, 800);
        // draws number of number of houses corresponding to a selected position.
        for (let i = 1; i <= numberOfHouses; i += 1) {
            const coordinate = getHouseCoord(position, i);
            ctx.beginPath();
            ctx.drawImage(img, coordinate[0], coordinate[1]);
            ctx.closePath();
        }
    };
    img.src = 'house.png';
}

/**
 * A function which wipes a canvas of its drawn images.
 *
 * @param {string} canvasID - id of canvas to clear.
 */
export function clear(canvasID) {
    const c = document.getElementById(canvasID);
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
}

/**
 * A function that displays houses and hotels on the board.
 *
 * @param {object} houses - dictionary key: position on the board, value: number of houses.
 * @param {object} hotels - dictionary key: position on the board, value: number of hotels.
 */
export function displayBuildings(houses, hotels) {
    clear('buildingLayer');
    for (let i = 0; i < Object.keys(houses).length; i += 1) {
        const position = Object.keys(houses)[i];
        const numberOfHouses = houses[position];
        const numberOfHotels = hotels[position];

        displayHouses(position, numberOfHouses);
        if (numberOfHotels > 0) {
            displayHotel(position);
        }
    }
}
