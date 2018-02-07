// Import sendJSON functionality
import sendJSON from './sendJSON';

export default function getGameID(player_count = 4) {
    sendJSON({
        serverAddress: 'cgi-bin/allocate_game_id.py',
        jsonObject: JSON.dumps({game_size: player_count}),
        successCallback: (req1) => {
            const response = JSON.load(req1.responseText);
            const gameID = response.game_id;
            sendJSON({
                serverAddress: 'cgi-bin/waiting_game.py',
                jsonObject: JSON.dumps({gameID}),
                /* successCallback: (req2) => {
                    // const responseSuccess = JSON.load(req2.responseText);
                    // Display waiting game.
                }, */
            });
        },
    });
}
