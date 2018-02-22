export default function activeGame(gameID) {
    // my dummy active game to display board.
    /* eslint no-console: ["error", { allow: ["log"] }] */
    console.log(`Active game called with ${gameID}`);
    document.getElementById('content').innerHTML = '<canvas id="myCanvas" width="450" height="450" style="border:1px solid #000000;">';
    const c = document.getElementById('myCanvas');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.src = 'monopoly.jpeg';
    ctx.drawImage(img, 0, 0);
}
