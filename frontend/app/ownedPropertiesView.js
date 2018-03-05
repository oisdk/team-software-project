/**
 * Displays owned properties in a game.
 */
export class OwnedPropertiesView {
    /**
     * Creates a new view.
     *
     * @param {HTMLElement} rootDisplayElement The root element the display will be
     *        constructed under.
     */
    constructor(rootDisplayElement) {
        this.rootElement = rootDisplayElement;
        this.tableBody = OwnedPropertiesView.createTable(rootDisplayElement);
        this.rows = {};
    }

    /**
     * Creates a table to display property ownership details for the game.
     *
     * @param {HTMLElement} rootElement The element to which the property table
     *        will be appended.
     * @return {HTMLElement} The tbody element of the created table.
     */
    static createTable(rootElement) {
        const table = document.createElement('table');

        const header = table.createTHead();
        const headerRow = header.insertRow(0);
        const firstHeaderCell = headerRow.insertCell(0);
        const secondHeaderCell = headerRow.insertCell(1);
        firstHeaderCell.innerHTML = 'Properties';
        secondHeaderCell.innerHTML = 'Owner';

        const body = document.createElement('tbody');
        table.appendChild(body);

        rootElement.appendChild(table);
        return body;
    }

    /**
     * A description of a change in the ownership of a property.
     *
     * @typedef {Object} propertyOwnershipChange
     * @property {Object} property The details of the property. Has keys
     *     "position" and "name".
     * @property {Object} oldOwner The previous owner of the property, or null
     *           if it was previously unowned. Has keys "id" and "name".
     * @property {Object} newOwner The new owner of the property, or null if it
     *           is now unowned. Has keys "id" and "name".
     * @global
     */

    /**
     * Updates the table.
     *
     * @param {Array<propertyOwnershipChange>} changes The changes in property
     *        ownership that have happened.
     */
    update(changes) {
        for (let i = 0; i < changes.length; i += 1) {
            if (changes[i].oldOwner === null) {
                this.addNewProperty({
                    property: changes[i].property.name,
                    newOwner: changes[i].newOwner.name,
                });
            } else if (changes[i].newOwner === null) {
                this.removeProperty({
                    property: changes[i].property.name,
                });
            } else {
                this.updateProperty({
                    property: changes[i].property.name,
                    newOwner: changes[i].newOwner.name,
                });
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
        const row = this.tableBody.insertRow(-1);
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
        this.tableBody.deleteRow(this.rows[property].rowIndex - 1);
        delete this.rows[property];
    }
}
