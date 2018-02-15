import {initialiseEventSource} from './sse';
import * as random from './random';

describe('initialiseEventSource', () => {
    let mockEventSource;

    beforeEach(() => {
        mockEventSource = {
            addEventListener: jest.fn(),
        };
        window.EventSource = jest.fn(() => mockEventSource);
    });

    it('should call mock EventSource constructor', () => {
        const mockGameId = random.int(0, 1000);
        initialiseEventSource(mockGameId);
        expect(window.EventSource).toHaveBeenCalledWith(`cgi-bin/game_event_source.py?game=${mockGameId}`);
    });

    it('should return mockEventSource', () => {
        const mockGameId = random.int(0, 1000);
        const result = initialiseEventSource(mockGameId);
        expect(result).toBe(mockEventSource);
    });

    afterEach(() => {
        window.EventSource = undefined;
    });
});
