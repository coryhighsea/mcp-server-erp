import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function costOptimizationPrompts(server: McpServer) {
  // Cost structure analysis prompt
  server.prompt(
    "analyze-cost-structure",
    "Analyze product cost structure and identify optimization opportunities",
    {
      productId: z.string(),
      costData: z.string()
    },
    (args) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `You are an expert in cost structure analysis. Analyze the provided cost data to identify optimization opportunities and potential cost savings.

Please analyze the cost structure for product ${args.productId}.

Cost Data:
${args.costData}

Please provide:
1. Breakdown of cost components and their percentages
2. Identification of high-cost areas
3. Comparison with industry benchmarks
4. Specific cost reduction recommendations
5. Implementation strategy for cost optimization`
        }
      }]
    })
  );

  // Supplier cost analysis prompt
  server.prompt(
    "analyze-supplier-costs",
    "Analyze supplier costs and performance metrics",
    {
      supplierId: z.string(),
      costData: z.string()
    },
    (args) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `You are an expert in supplier cost analysis. Evaluate supplier costs and performance to identify optimization opportunities.

Please analyze the costs and performance for supplier ${args.supplierId}.

Cost and Performance Data:
${args.costData}

Please provide:
1. Total cost analysis by component
2. Quality vs. cost trade-off analysis
3. Volume discount opportunities
4. Alternative supplier recommendations
5. Negotiation strategy for cost reduction`
        }
      }]
    })
  );

  // Process optimization prompt
  server.prompt(
    "analyze-process-costs",
    "Analyze manufacturing and operational process costs",
    {
      processId: z.string(),
      processData: z.string()
    },
    (args) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `You are an expert in process optimization. Analyze manufacturing and operational processes to identify cost reduction opportunities.

Please analyze the process costs for ${args.processId}.

Process Data:
${args.processData}

Please provide:
1. Process flow analysis
2. Bottleneck identification and solutions
3. Resource utilization optimization
4. Automation opportunities
5. Implementation roadmap for process improvements`
        }
      }]
    })
  );

  // Inventory holding cost analysis prompt
  server.prompt(
    "analyze-inventory-costs",
    "Analyze inventory holding costs and optimization opportunities",
    {
      productId: z.string(),
      inventoryData: z.string()
    },
    (args) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `You are an expert in inventory cost analysis. Evaluate inventory holding costs and identify optimization opportunities.

Please analyze the inventory costs for product ${args.productId}.

Inventory Data:
${args.inventoryData}

Please provide:
1. Current inventory cost analysis
2. Optimal inventory level calculation
3. Stockout risk assessment
4. Cost reduction strategies
5. Implementation plan for inventory optimization`
        }
      }]
    })
  );
} 