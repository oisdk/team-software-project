// Import sendJSON functionality
import sendJSON from './sendJSON';

export default function getGameID(player_count = 4) {
    sendJSON({
        serverAddress: 'cgi-bin/allocate_game_id.py',
        jsonObject: JSON.stringify({game_size: player_count}),
        successCallback: (req1) => {
            const response = JSON.parse(req1.responseText);
            const gameID = response.game_id;
            sendJSON({
                serverAddress: 'cgi-bin/waiting_game.py',
                jsonObject: JSON.stringify({gameID: gameID}),
                /* successCallback: (req2) => {
                    // const responseSuccess = JSON.parse(req2.responseText);
                    // Display waiting game.
                }, */
            });
        },
    });
}
