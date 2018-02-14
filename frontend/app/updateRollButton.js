// Enables the roll button for the player if the previous
// roll values are equal
export function checkRollValuesEqual() {
    if (xhttp.readyState === 4 && xhttp.status === 200){
		const state = JSON.parse(xhttp.responseText);
		const roll_die = document.querySelector('#roll');
		roll_die.disabled = !state;
	}
}
// Adds event listener to the roll button for the player to
// enable/disable the button
export function validateRollButton() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => checkRollValuesEqual(xhttp);
    xhttp.open('POST', 'cgi-bin/compare_dice_rolls.py', true);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send();
}
