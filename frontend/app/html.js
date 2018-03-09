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
