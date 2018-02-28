import {OwnedPropertiesView} from './ownedPropertiesView';

function createMockElement() {
    return {appendChild: jest.fn()};
}

describe('OwnedPropertiesView', () => {
    it('should create a table under the given root', () => {
        const mockElement = createMockElement();
        const view = new OwnedPropertiesView(mockElement);
        expect(view).toBeDefined();
        expect(mockElement.appendChild).toHaveBeenCalled();
        const child = mockElement.appendChild.mock.calls[0][0];
        expect(child).toBeInstanceOf(HTMLTableElement);
    });

    it('should create new rows', () => {
        const mockElement = createMockElement();
        const testProperty = 'Old Kent Road';
        const testOwner = 'Beth';
        const view = new OwnedPropertiesView(mockElement);
        view.update([
            {
                property: testProperty,
                oldOwner: null,
                newOwner: testOwner,
            },
        ]);
        const table = mockElement.appendChild.mock.calls[0][0];
        expect(table.rows.length).toEqual(2);
        expect(table.rows[1].cells[0].innerHTML).toEqual(testProperty);
        expect(table.rows[1].cells[1].innerHTML).toEqual(testOwner);
    });
});
