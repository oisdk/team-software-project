export function generateJSON() {
    var data = {"type":"gameStart"};
    var stringifiedData = JSON.stringify(data);
    return stringifiedData;
}
