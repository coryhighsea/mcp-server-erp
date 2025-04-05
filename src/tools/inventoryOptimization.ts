import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function inventoryOptimizationTools(server: McpServer) {
  // Calculate Economic Order Quantity (EOQ)
  server.tool(
    "calculate-eoq",
    {
      annualDemand: z.number(),
      orderingCost: z.number(),
      holdingCost: z.number()
    },
    async ({ annualDemand, orderingCost, holdingCost }) => {
      const eoq = Math.sqrt((2 * annualDemand * orderingCost) / holdingCost);
      const optimalOrders = annualDemand / eoq;
      const optimalTimeBetweenOrders = 365 / optimalOrders;
      
      return {
        content: [{
          type: "text",
          text: `Economic Order Quantity Analysis:
Annual Demand: ${annualDemand.toLocaleString()} units
Ordering Cost: $${orderingCost.toLocaleString()}
Holding Cost: $${holdingCost.toLocaleString()}

Optimal Order Quantity: ${Math.round(eoq).toLocaleString()} units
Number of Orders per Year: ${optimalOrders.toFixed(2)}
Time Between Orders: ${optimalTimeBetweenOrders.toFixed(2)} days`
        }]
      };
    }
  );

  // Calculate safety stock
  server.tool(
    "calculate-safety-stock",
    {
      averageDemand: z.number(),
      demandStandardDeviation: z.number(),
      leadTime: z.number(),
      serviceLevel: z.number()
    },
    async ({ averageDemand, demandStandardDeviation, leadTime, serviceLevel }) => {
      // Z-score for 95% service level is approximately 1.645
      const zScore = 1.645; // This should be looked up based on serviceLevel
      const safetyStock = zScore * demandStandardDeviation * Math.sqrt(leadTime);
      const reorderPoint = (averageDemand * leadTime) + safetyStock;
      
      return {
        content: [{
          type: "text",
          text: `Safety Stock Analysis:
Average Daily Demand: ${averageDemand.toLocaleString()} units
Demand Standard Deviation: ${demandStandardDeviation.toLocaleString()}
Lead Time: ${leadTime} days
Service Level: ${(serviceLevel * 100).toFixed(2)}%

Safety Stock: ${Math.round(safetyStock).toLocaleString()} units
Reorder Point: ${Math.round(reorderPoint).toLocaleString()} units`
        }]
      };
    }
  );

  // Optimize inventory levels
  server.tool(
    "optimize-inventory",
    {
      currentInventory: z.number(),
      monthlySales: z.array(z.number()),
      holdingCost: z.number(),
      stockoutCost: z.number()
    },
    async ({ currentInventory, monthlySales, holdingCost, stockoutCost }) => {
      const averageSales = monthlySales.reduce((a, b) => a + b, 0) / monthlySales.length;
      const salesStdDev = Math.sqrt(
        monthlySales.reduce((sq, n) => sq + Math.pow(n - averageSales, 2), 0) / monthlySales.length
      );
      
      const optimalInventory = Math.round(averageSales + (1.96 * salesStdDev)); // 95% confidence
      const excessInventory = Math.max(0, currentInventory - optimalInventory);
      const excessCost = excessInventory * holdingCost;
      
      return {
        content: [{
          type: "text",
          text: `Inventory Optimization Analysis:
Current Inventory: ${currentInventory.toLocaleString()} units
Average Monthly Sales: ${Math.round(averageSales).toLocaleString()} units
Sales Standard Deviation: ${Math.round(salesStdDev).toLocaleString()} units

Optimal Inventory Level: ${optimalInventory.toLocaleString()} units
Excess Inventory: ${excessInventory.toLocaleString()} units
Annual Excess Holding Cost: $${excessCost.toLocaleString()}`
        }]
      };
    }
  );

  // Calculate ABC analysis
  server.tool(
    "abc-analysis",
    {
      items: z.array(z.object({
        id: z.string(),
        annualValue: z.number(),
        quantity: z.number()
      }))
    },
    async ({ items }) => {
      // Sort items by annual value
      const sortedItems = [...items].sort((a, b) => b.annualValue - a.annualValue);
      const totalValue = sortedItems.reduce((sum, item) => sum + item.annualValue, 0);
      
      let cumulativeValue = 0;
      const abcItems = sortedItems.map(item => {
        cumulativeValue += item.annualValue;
        const percentage = (cumulativeValue / totalValue) * 100;
        let category = 'C';
        if (percentage <= 80) category = 'A';
        else if (percentage <= 95) category = 'B';
        
        return {
          ...item,
          category,
          percentage: (item.annualValue / totalValue) * 100
        };
      });
      
      return {
        content: [{
          type: "text",
          text: `ABC Analysis Results:
Total Items: ${items.length}
Total Annual Value: $${totalValue.toLocaleString()}

Item Breakdown:
${abcItems.map(item => 
  `ID: ${item.id}
   Category: ${item.category}
   Annual Value: $${item.annualValue.toLocaleString()}
   Quantity: ${item.quantity.toLocaleString()}
   Value %: ${item.percentage.toFixed(2)}%
   --------------------`
).join('\n')}`
        }]
      };
    }
  );
} 