import getGameID from './createGame';
import sendJSON from './sendJSON';

jest.mock('./sendJSON');

describe('getGameID sendJSONCheck', () => {
    getGameID();

    expect(sendJSON).toHaveBeenCalledTimes(2);
    expect(sendJSON).toHaveBeenCalledWith();
});
