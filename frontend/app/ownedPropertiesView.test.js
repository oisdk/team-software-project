import {OwnedPropertiesView} from './ownedPropertiesView';

function createMockElement() {
    return {appendChild: jest.fn()};
}

describe('OwnedPropertiesView', () => {
    const mockElement = createMockElement();
    const view = new OwnedPropertiesView(mockElement);
    const table = mockElement.appendChild.mock.calls[0][0];
    const headerRow = table.rows[0];

    it('should create a table under the given root', () => {
        expect(view).toBeDefined();
        expect(mockElement.appendChild).toHaveBeenCalled();
        expect(table).toBeInstanceOf(HTMLTableElement);
        expect(headerRow).toBeDefined();
    });

    const testProperty = 'Old Kent Road';
    const testOwner = 'Kate';

    it('should create new rows', () => {
        view.update([
            {
                property: testProperty,
                oldOwner: null,
                newOwner: testOwner,
            },
        ]);
        expect(table.rows.length).toEqual(2);
        expect(table.rows[1].cells[0].innerHTML).toEqual(testProperty);
        expect(table.rows[1].cells[1].innerHTML).toEqual(testOwner);
    });

    const newTestOwner = 'Beth';

    it('should update rows', () => {
        view.update([
            {
                property: testProperty,
                oldOwner: testOwner,
                newOwner: newTestOwner,
            },
        ]);

        expect(table.rows[1].cells[1].innerHTML).toEqual(newTestOwner);
    });

    it('should delete rows', () => {
        view.update([
            {
                property: testProperty,
                oldOwner: newTestOwner,
                newOwner: null,
            },
        ]);

        expect(table.rows.length).toEqual(1);
        expect(table.rows[0]).toBe(headerRow);
    });
});
