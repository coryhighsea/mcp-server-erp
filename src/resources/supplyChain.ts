import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

type Supplier = {
  id: string;
  name: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  leadTime: number;
  reliability: number;
  items: string[];
  paymentTerms: string;
  rating: number;
  lastOrderDate: string;
};

type Order = {
  id: string;
  supplierId: string;
  items: Array<{
    itemId: string;
    quantity: number;
    unitPrice: number;
  }>;
  status: "pending" | "confirmed" | "in-transit" | "delivered" | "cancelled";
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  totalAmount: number;
  paymentStatus: "pending" | "partial" | "paid";
};

type SupplyChainData = {
  suppliers: Record<string, Supplier>;
  orders: Record<string, Order>;
};

// Mock supply chain data - replace with actual ERP integration
const mockSupplyChainData: SupplyChainData = {
  suppliers: {
    "supplier-001": {
      id: "supplier-001",
      name: "Global Parts Inc.",
      contact: {
        email: "contact@globalparts.com",
        phone: "+1-555-123-4567",
        address: "123 Industrial Park, New York, NY 10001"
      },
      leadTime: 14,
      reliability: 0.95,
      items: ["item-001", "item-002"],
      paymentTerms: "Net 30",
      rating: 4.5,
      lastOrderDate: "2024-04-01"
    },
    "supplier-002": {
      id: "supplier-002",
      name: "Quality Components Ltd",
      contact: {
        email: "sales@qualitycomponents.com",
        phone: "+44-20-1234-5678",
        address: "45 Manufacturing Way, London, UK"
      },
      leadTime: 7,
      reliability: 0.98,
      items: ["item-003"],
      paymentTerms: "Net 45",
      rating: 4.8,
      lastOrderDate: "2024-03-28"
    },
    "supplier-003": {
      id: "supplier-003",
      name: "Raw Materials Co.",
      contact: {
        email: "info@rawmaterials.com",
        phone: "+1-555-987-6543",
        address: "789 Resource Ave, Chicago, IL 60601"
      },
      leadTime: 10,
      reliability: 0.92,
      items: ["item-004"],
      paymentTerms: "Net 60",
      rating: 4.2,
      lastOrderDate: "2024-04-02"
    }
  },
  orders: {
    "order-001": {
      id: "order-001",
      supplierId: "supplier-001",
      items: [
        {
          itemId: "item-001",
          quantity: 100,
          unitPrice: 25.99
        }
      ],
      status: "in-transit",
      orderDate: "2024-03-28",
      expectedDelivery: "2024-04-18",
      totalAmount: 2599.00,
      paymentStatus: "partial"
    },
    "order-002": {
      id: "order-002",
      supplierId: "supplier-002",
      items: [
        {
          itemId: "item-003",
          quantity: 200,
          unitPrice: 12.50
        }
      ],
      status: "confirmed",
      orderDate: "2024-04-01",
      expectedDelivery: "2024-04-08",
      totalAmount: 2500.00,
      paymentStatus: "pending"
    },
    "order-003": {
      id: "order-003",
      supplierId: "supplier-003",
      items: [
        {
          itemId: "item-004",
          quantity: 500,
          unitPrice: 8.75
        }
      ],
      status: "delivered",
      orderDate: "2024-03-25",
      expectedDelivery: "2024-04-04",
      actualDelivery: "2024-04-03",
      totalAmount: 4375.00,
      paymentStatus: "paid"
    }
  }
};

export function supplyChainResources(server: McpServer) {
  // Get supplier information
  server.resource(
    "supplier-info",
    new ResourceTemplate("supply-chain://suppliers/{supplierId}", { list: undefined }),
    async (uri, { supplierId }) => {
      const supplier = mockSupplyChainData.suppliers[supplierId as string];
      if (!supplier) {
        throw new Error(`Supplier ${supplierId} not found`);
      }
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(supplier, null, 2)
        }]
      };
    }
  );

  // List all suppliers
  server.resource(
    "suppliers",
    "supply-chain://suppliers",
    async (uri) => {
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(Object.values(mockSupplyChainData.suppliers), null, 2)
        }]
      };
    }
  );

  // Get order status
  server.resource(
    "order-status",
    new ResourceTemplate("supply-chain://orders/{orderId}", { list: undefined }),
    async (uri, { orderId }) => {
      const order = mockSupplyChainData.orders[orderId as string];
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(order, null, 2)
        }]
      };
    }
  );

  // Get supplier performance metrics
  server.resource(
    "supplier-performance",
    new ResourceTemplate("supply-chain://performance/{supplierId}", { list: undefined }),
    async (uri, { supplierId }) => {
      const supplier = mockSupplyChainData.suppliers[supplierId as string];
      if (!supplier) {
        throw new Error(`Supplier ${supplierId} not found`);
      }

      const supplierOrders = Object.values(mockSupplyChainData.orders)
        .filter(order => order.supplierId === supplierId);

      const metrics = {
        supplierId,
        name: supplier.name,
        totalOrders: supplierOrders.length,
        onTimeDelivery: supplierOrders.filter(order => 
          order.status === "delivered" && 
          order.actualDelivery && 
          new Date(order.actualDelivery) <= new Date(order.expectedDelivery)
        ).length,
        totalSpend: supplierOrders.reduce((sum, order) => sum + order.totalAmount, 0),
        reliability: supplier.reliability,
        rating: supplier.rating
      };

      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(metrics, null, 2)
        }]
      };
    }
  );

  // Get pending orders
  server.resource(
    "pending-orders",
    "supply-chain://orders/pending",
    async (uri) => {
      const pendingOrders = Object.values(mockSupplyChainData.orders)
        .filter(order => order.status === "pending" || order.status === "confirmed");
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(pendingOrders, null, 2)
        }]
      };
    }
  );
} 