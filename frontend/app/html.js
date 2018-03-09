/**
 * Provides extra functions for manipulating html.
 * @module
 */

/**
 * Removes all children of an element.
 *
 * @param {HTMLElement} element The element whose children should be removed.
 */
export function removeChildren(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
}

/**
 * Creates a button element with the necessary classes.
 *
 * @param {String} text The text content the button should contain.
 * @return {HTMLElement} The created element.
 */
export function createButton(text) {
    const button = document.createElement('button');
    button.className = 'btn btn-info btn-block';
    button.textContent = text;
    return button;
}
