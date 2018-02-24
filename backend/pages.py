pages = {
    'example': 'backend.example:example',
    'request_dice_roll': 'backend.process_client_json:request_dice_roll',
    'receive_client_username':
    'backend.process_client_json:receive_client_username',
    'request_games_list': 'backend.request_game_list:request_game_list',
    'allocate_user_id': 'backend.allocate_user_id:request_user_id',
    'allocate_game_id': 'backend.allocate_game_id:request_game_id',
    'get_game_details': 'backend.request_game_details:request_game_details',
    'game_event_source': 'backend.events:start_sse_stream',
    'roll_dice': 'backend.roll_die:player_roll_dice',
    'start-game': 'backend.start_game:start_game',
    'game_event_source': 'backend.events:start_sse_stream',
    'join_game': 'backend.join_game:join_game',
    'increment_turn': 'backend.increment_turn:increment_turn',
    'check_position': 'backend.check_position:check_position',
}
