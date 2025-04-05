import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
// Mock supply chain data - replace with actual ERP integration
const mockSupplyChainData = {
    suppliers: {
        "supplier-001": {
            id: "supplier-001",
            name: "Global Parts Inc.",
            leadTime: 14,
            reliability: 0.95,
            items: ["item-001", "item-002"]
        },
        "supplier-002": {
            id: "supplier-002",
            name: "Quality Components Ltd",
            leadTime: 7,
            reliability: 0.98,
            items: ["item-003"]
        }
    },
    orders: {
        "order-001": {
            id: "order-001",
            supplierId: "supplier-001",
            items: ["item-001"],
            status: "in-transit",
            expectedDelivery: "2024-04-18"
        }
    }
};
export function supplyChainResources(server) {
    // Get supplier information
    server.resource("supplier-info", new ResourceTemplate("supply-chain://suppliers/{supplierId}", { list: undefined }), async (uri, { supplierId }) => {
        const supplier = mockSupplyChainData.suppliers[supplierId];
        if (!supplier) {
            throw new Error(`Supplier ${supplierId} not found`);
        }
        return {
            contents: [{
                    uri: uri.href,
                    text: JSON.stringify(supplier, null, 2)
                }]
        };
    });
    // List all suppliers
    server.resource("suppliers", "supply-chain://suppliers", async (uri) => {
        return {
            contents: [{
                    uri: uri.href,
                    text: JSON.stringify(Object.values(mockSupplyChainData.suppliers), null, 2)
                }]
        };
    });
    // Get order status
    server.resource("order-status", new ResourceTemplate("supply-chain://orders/{orderId}", { list: undefined }), async (uri, { orderId }) => {
        const order = mockSupplyChainData.orders[orderId];
        if (!order) {
            throw new Error(`Order ${orderId} not found`);
        }
        return {
            contents: [{
                    uri: uri.href,
                    text: JSON.stringify(order, null, 2)
                }]
        };
    });
    // Get supplier performance metrics
    server.resource("supplier-performance", new ResourceTemplate("supply-chain://performance/{supplierId}", { list: undefined }), async (uri, { supplierId }) => {
        const supplier = mockSupplyChainData.suppliers[supplierId];
        if (!supplier) {
            throw new Error(`Supplier ${supplierId} not found`);
        }
        const performance = {
            supplierId,
            leadTime: supplier.leadTime,
            reliability: supplier.reliability,
            onTimeDelivery: 0.92, // Mocked metric
            qualityScore: 0.95 // Mocked metric
        };
        return {
            contents: [{
                    uri: uri.href,
                    text: JSON.stringify(performance, null, 2)
                }]
        };
    });
}
//# sourceMappingURL=supplyChain.js.map