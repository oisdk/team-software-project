/**
 * This module provides access to the SSE event source.
 */

let eventSource;

/**
 * Initialises the event source and returns it.
 *
 * @param gameID The ID of the game to receive events for.
 * @return {EventSource} The newly-initialised event source.
 */
export function initialiseEventSource(gameID) {
    eventSource = new EventSource(`cgi-bin/game_event_source.py?game=${gameID}`);
    return eventSource;
}

/**
 * Returns the event source.
 *
 * @return {EventSource} The current event source, or undefined if it hasn’t been initialised.
 */
export function getEventSource() {
    return eventSource;
}
