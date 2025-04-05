import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
// Mock ERP data - replace with actual ERP integration
const mockInventory = {
    "item-001": {
        id: "item-001",
        name: "Widget A",
        description: "High-quality industrial widget",
        category: "Electronics",
        quantity: 100,
        unitPrice: 25.99,
        location: "Warehouse 1",
        minStockLevel: 50,
        maxStockLevel: 200,
        lastUpdated: "2024-04-04",
        supplierId: "supplier-001"
    },
    "item-002": {
        id: "item-002",
        name: "Widget B",
        description: "Premium grade widget",
        category: "Electronics",
        quantity: 50,
        unitPrice: 45.99,
        location: "Warehouse 2",
        minStockLevel: 30,
        maxStockLevel: 150,
        lastUpdated: "2024-04-04",
        supplierId: "supplier-001"
    },
    "item-003": {
        id: "item-003",
        name: "Component X",
        description: "Essential assembly component",
        category: "Mechanical",
        quantity: 200,
        unitPrice: 12.50,
        location: "Warehouse 1",
        minStockLevel: 100,
        maxStockLevel: 400,
        lastUpdated: "2024-04-05",
        supplierId: "supplier-002"
    },
    "item-004": {
        id: "item-004",
        name: "Raw Material Y",
        description: "High-grade raw material",
        category: "Raw Materials",
        quantity: 500,
        unitPrice: 8.75,
        location: "Warehouse 3",
        minStockLevel: 200,
        maxStockLevel: 1000,
        lastUpdated: "2024-04-05",
        supplierId: "supplier-003"
    }
};
export function inventoryResources(server) {
    // Get inventory item by ID
    server.resource("inventory-item", new ResourceTemplate("inventory://items/{itemId}", { list: undefined }), async (uri, { itemId }) => {
        const item = mockInventory[itemId];
        if (!item) {
            throw new Error(`Item ${itemId} not found`);
        }
        return {
            contents: [{
                    uri: uri.href,
                    text: JSON.stringify(item, null, 2)
                }]
        };
    });
    // List all inventory items
    server.resource("inventory-list", "inventory://items", async (uri) => {
        return {
            contents: [{
                    uri: uri.href,
                    text: JSON.stringify(Object.values(mockInventory), null, 2)
                }]
        };
    });
    // Get inventory by category
    server.resource("inventory-by-category", new ResourceTemplate("inventory://categories/{category}", { list: undefined }), async (uri, { category }) => {
        const items = Object.values(mockInventory).filter(item => item.category === category);
        return {
            contents: [{
                    uri: uri.href,
                    text: JSON.stringify(items, null, 2)
                }]
        };
    });
    // Get inventory levels by location
    server.resource("inventory-by-location", new ResourceTemplate("inventory://locations/{location}", { list: undefined }), async (uri, { location }) => {
        const items = Object.values(mockInventory).filter(item => item.location === location);
        return {
            contents: [{
                    uri: uri.href,
                    text: JSON.stringify(items, null, 2)
                }]
        };
    });
    // Get low stock items
    server.resource("low-stock", new ResourceTemplate("inventory://low-stock/{threshold}", { list: undefined }), async (uri, { threshold }) => {
        const lowStockItems = Object.values(mockInventory)
            .filter(item => item.quantity <= parseInt(threshold));
        return {
            contents: [{
                    uri: uri.href,
                    text: JSON.stringify(lowStockItems, null, 2)
                }]
        };
    });
    // Get inventory value by location
    server.resource("inventory-value", new ResourceTemplate("inventory://value/{location}", { list: undefined }), async (uri, { location }) => {
        const items = Object.values(mockInventory).filter(item => item.location === location);
        const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        return {
            contents: [{
                    uri: uri.href,
                    text: JSON.stringify({
                        location,
                        totalValue,
                        items: items.map(item => ({
                            id: item.id,
                            name: item.name,
                            value: item.quantity * item.unitPrice
                        }))
                    }, null, 2)
                }]
        };
    });
}
//# sourceMappingURL=inventory.js.map