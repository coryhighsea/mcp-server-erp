import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
// Mock financial data - replace with actual ERP integration
const mockFinancialData = {
    revenue: {
        "2024-Q1": 1000000,
        "2024-Q2": 1200000
    },
    expenses: {
        "2024-Q1": 800000,
        "2024-Q2": 900000
    },
    profit: {
        "2024-Q1": 200000,
        "2024-Q2": 300000
    }
};
export function financialResources(server) {
    // Get financial metrics by period
    server.resource("financial-metrics", new ResourceTemplate("financial://metrics/{period}", { list: undefined }), async (uri, { period }) => {
        const metrics = {
            revenue: mockFinancialData.revenue[period],
            expenses: mockFinancialData.expenses[period],
            profit: mockFinancialData.profit[period]
        };
        return {
            contents: [{
                    uri: uri.href,
                    text: JSON.stringify(metrics, null, 2)
                }]
        };
    });
    // Get revenue data
    server.resource("revenue", new ResourceTemplate("financial://revenue/{period}", { list: undefined }), async (uri, { period }) => {
        const revenue = mockFinancialData.revenue[period];
        return {
            contents: [{
                    uri: uri.href,
                    text: JSON.stringify({ period, revenue }, null, 2)
                }]
        };
    });
    // Get expense breakdown
    server.resource("expenses", new ResourceTemplate("financial://expenses/{period}", { list: undefined }), async (uri, { period }) => {
        const expenses = mockFinancialData.expenses[period];
        return {
            contents: [{
                    uri: uri.href,
                    text: JSON.stringify({ period, expenses }, null, 2)
                }]
        };
    });
    // Get profit margins
    server.resource("profit-margins", new ResourceTemplate("financial://profit-margins/{period}", { list: undefined }), async (uri, { period }) => {
        const revenue = mockFinancialData.revenue[period];
        const profit = mockFinancialData.profit[period];
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
    });
}
//# sourceMappingURL=financial.js.map