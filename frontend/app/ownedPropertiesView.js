/**
 * Provides a class for displaying the owned properties in a game.
 * @module
 */

/**
 * Displays owned properties in a game.
 */
export class OwnedPropertiesView {
    /**
     * Creates a new view.
     *
     * @param rootDisplayElement The root element the display will be
     *        constructed under.
     */
    constructor(rootDisplayElement) {
        this.rootElement = rootDisplayElement;
        this.table = OwnedPropertiesView.createTable(rootDisplayElement);
        this.rows = {};
    }

    /**
     * Creates a table to display property ownership details for the game.
     *
     * @param {HTMLElement} rootElement The element to which the property table
     *        will be appended.
     * @return {HTMLElement} The root element of the created table.
     */
    static createTable(rootElement) {
        const table = document.createElement('table');

        const header = table.createTHead();
        const headerRow = header.insertRow(0);
        const firstHeaderCell = headerRow.insertCell(0);
        const secondHeaderCell = headerRow.insertCell(1);
        firstHeaderCell.innerHTML = 'Properties';
        secondHeaderCell.innerHTML = 'Owner';

        rootElement.appendChild(table);
        return table;
    }

    /**
     * Updates the table.
     *
     * @param {object} changes An array of objects with the following format:
     *        {"newOwner": <username>, "oldOwner": <username>,
     *        "property": <property name>}
     */
    update(changes) {
        for (let i = 0; i < changes.length; i += 1) {
            if (changes[i].oldOwner === null) {
                this.addNewProperty(changes[i]);
            } else if (changes[i].newOwner === null) {
                this.removeProperty(changes[i]);
            } else {
                this.updateProperty(changes[i]);
            }
        }
    }

    /**
     * Adds a new owned property to the table.
     *
     * @param {String} property The name of the property to add.
     * @param {String} newOwner The name of the new owner of the property.
     */
    addNewProperty({property, newOwner}) {
        const row = this.table.insertRow(-1);
        row.insertCell(0).innerHTML = property;
        row.insertCell(1).innerHTML = newOwner;
        this.rows[property] = row;
    }

    /**
     * Updates the details for a property in the table.
     *
     * @param {String} property The name of the property to update.
     * @param {String} newOwner The name of the new owner of the property.
     */
    updateProperty({property, newOwner}) {
        this.rows[property].cells[1].innerHTML = newOwner;
    }

    /**
     * Removes a property from the table.
     *
     * @param {String} property The name of the property to remove.
     */
    removeProperty({property}) {
        this.table.deleteRow(this.rows[property].rowIndex);
        delete this.rows[property];
    }
}
