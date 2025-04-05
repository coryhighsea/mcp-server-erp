import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  location: string;
  lastUpdated: string;
};

type InventoryData = {
  [key: string]: InventoryItem;
};

// Mock ERP data - replace with actual ERP integration
const mockInventory: InventoryData = {
  "item-001": {
    id: "item-001",
    name: "Widget A",
    quantity: 100,
    location: "Warehouse 1",
    lastUpdated: "2024-04-04"
  },
  "item-002": {
    id: "item-002",
    name: "Widget B",
    quantity: 50,
    location: "Warehouse 2",
    lastUpdated: "2024-04-04"
  }
};

export function inventoryResources(server: McpServer) {
  // Get inventory item by ID
  server.resource(
    "inventory-item",
    new ResourceTemplate("inventory://items/{itemId}", { list: undefined }),
    async (uri, { itemId }) => {
      const item = mockInventory[itemId as string];
      if (!item) {
        throw new Error(`Item ${itemId} not found`);
      }
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(item, null, 2)
        }]
      };
    }
  );

  // List all inventory items
  server.resource(
    "inventory-list",
    "inventory://items",
    async (uri) => {
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(Object.values(mockInventory), null, 2)
        }]
      };
    }
  );

  // Get inventory levels by location
  server.resource(
    "inventory-by-location",
    new ResourceTemplate("inventory://locations/{location}", { list: undefined }),
    async (uri, { location }) => {
      const items = Object.values(mockInventory).filter(item => item.location === location);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(items, null, 2)
        }]
      };
    }
  );

  // Get low stock items
  server.resource(
    "low-stock",
    new ResourceTemplate("inventory://low-stock/{threshold}", { list: undefined }),
    async (uri, { threshold }) => {
      const lowStockItems = Object.values(mockInventory)
        .filter(item => item.quantity <= parseInt(threshold as string));
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(lowStockItems, null, 2)
        }]
      };
    }
  );
} 