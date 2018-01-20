import * as sendJSON from './sendJSON';

window.onload = () => {
    document.getElementById('roll_die').onclick = () => {
        sendJSON.gameStartRequest('https://cs1.ucc.ie/~dok4/cgi-bin/process_json.py', () => {});
    };
};
