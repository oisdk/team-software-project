import {OwnedPropertiesView} from './ownedPropertiesView';

describe('OwnedPropertiesView', () => {
    it('should create a table under the given root', () => {
        const mockElement = {
            appendChild: jest.fn(),
        };
        const view = new OwnedPropertiesView(mockElement);
        expect(view).toBeDefined();
        expect(mockElement.appendChild).toHaveBeenCalled();
        const child = mockElement.appendChild.mock.calls[0][0];
        expect(child).toBeInstanceOf(HTMLTableElement);
    });
});
