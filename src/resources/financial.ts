import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

type FinancialPeriod = "2024-Q1" | "2024-Q2" | "2024-Q3" | "2024-Q4";
type ExpenseCategory = "raw_materials" | "labor" | "overhead" | "marketing" | "r&d";

type FinancialData = {
  revenue: Record<FinancialPeriod, number>;
  expenses: Record<FinancialPeriod, Record<ExpenseCategory, number>>;
  profit: Record<FinancialPeriod, number>;
  cashFlow: Record<FinancialPeriod, number>;
  assets: Record<FinancialPeriod, number>;
  liabilities: Record<FinancialPeriod, number>;
};

// Mock financial data - replace with actual ERP integration
const mockFinancialData: FinancialData = {
  revenue: {
    "2024-Q1": 1000000,
    "2024-Q2": 1200000,
    "2024-Q3": 1300000,
    "2024-Q4": 1500000
  },
  expenses: {
    "2024-Q1": {
      raw_materials: 300000,
      labor: 250000,
      overhead: 150000,
      marketing: 50000,
      "r&d": 50000
    },
    "2024-Q2": {
      raw_materials: 350000,
      labor: 280000,
      overhead: 160000,
      marketing: 60000,
      "r&d": 55000
    },
    "2024-Q3": {
      raw_materials: 380000,
      labor: 300000,
      overhead: 170000,
      marketing: 70000,
      "r&d": 60000
    },
    "2024-Q4": {
      raw_materials: 400000,
      labor: 320000,
      overhead: 180000,
      marketing: 80000,
      "r&d": 65000
    }
  },
  profit: {
    "2024-Q1": 200000,
    "2024-Q2": 300000,
    "2024-Q3": 350000,
    "2024-Q4": 400000
  },
  cashFlow: {
    "2024-Q1": 180000,
    "2024-Q2": 280000,
    "2024-Q3": 320000,
    "2024-Q4": 380000
  },
  assets: {
    "2024-Q1": 2000000,
    "2024-Q2": 2200000,
    "2024-Q3": 2400000,
    "2024-Q4": 2600000
  },
  liabilities: {
    "2024-Q1": 800000,
    "2024-Q2": 900000,
    "2024-Q3": 950000,
    "2024-Q4": 1000000
  }
};

export function financialResources(server: McpServer) {
  // Get financial metrics by period
  server.resource(
    "financial-metrics",
    new ResourceTemplate("financial://metrics/{period}", { list: undefined }),
    async (uri, { period }) => {
      const metrics = {
        revenue: mockFinancialData.revenue[period as FinancialPeriod],
        expenses: mockFinancialData.expenses[period as FinancialPeriod],
        profit: mockFinancialData.profit[period as FinancialPeriod],
        cashFlow: mockFinancialData.cashFlow[period as FinancialPeriod],
        assets: mockFinancialData.assets[period as FinancialPeriod],
        liabilities: mockFinancialData.liabilities[period as FinancialPeriod]
      };
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(metrics, null, 2)
        }]
      };
    }
  );

  // Get revenue data
  server.resource(
    "revenue",
    new ResourceTemplate("financial://revenue/{period}", { list: undefined }),
    async (uri, { period }) => {
      const revenue = mockFinancialData.revenue[period as FinancialPeriod];
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({ period, revenue }, null, 2)
        }]
      };
    }
  );

  // Get expense breakdown
  server.resource(
    "expenses",
    new ResourceTemplate("financial://expenses/{period}", { list: undefined }),
    async (uri, { period }) => {
      const expenses = mockFinancialData.expenses[period as FinancialPeriod];
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({ period, expenses }, null, 2)
        }]
      };
    }
  );

  // Get profit margins
  server.resource(
    "profit-margins",
    new ResourceTemplate("financial://profit-margins/{period}", { list: undefined }),
    async (uri, { period }) => {
      const revenue = mockFinancialData.revenue[period as FinancialPeriod];
      const profit = mockFinancialData.profit[period as FinancialPeriod];
      const margin = (profit / revenue) * 100;
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({
            period,
            revenue,
            profit,
            margin: `${margin.toFixed(2)}%`
          }, null, 2)
        }]
      };
    }
  );

  // Get balance sheet
  server.resource(
    "balance-sheet",
    new ResourceTemplate("financial://balance-sheet/{period}", { list: undefined }),
    async (uri, { period }) => {
      const assets = mockFinancialData.assets[period as FinancialPeriod];
      const liabilities = mockFinancialData.liabilities[period as FinancialPeriod];
      const equity = assets - liabilities;
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({
            period,
            assets,
            liabilities,
            equity,
            debtToEquity: (liabilities / equity).toFixed(2)
          }, null, 2)
        }]
      };
    }
  );

  // Get cash flow analysis
  server.resource(
    "cash-flow",
    new ResourceTemplate("financial://cash-flow/{period}", { list: undefined }),
    async (uri, { period }) => {
      const cashFlow = mockFinancialData.cashFlow[period as FinancialPeriod];
      const profit = mockFinancialData.profit[period as FinancialPeriod];
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({
            period,
            cashFlow,
            profit,
            cashConversion: ((cashFlow / profit) * 100).toFixed(2) + '%'
          }, null, 2)
        }]
      };
    }
  );
} 