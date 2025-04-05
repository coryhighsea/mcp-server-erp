import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function forecastingPrompts(server: McpServer) {
  // Demand forecasting prompt
  server.prompt(
    "forecast-demand",
    "Generate demand forecast based on historical data",
    {
      productId: z.string(),
      historicalData: z.string(),
      forecastPeriods: z.string()
    },
    (args) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `You are an expert demand forecasting analyst. Analyze the provided historical sales data and generate a detailed forecast for the specified number of periods. Consider seasonality, trends, and any relevant market factors.

Please analyze the historical sales data for product ${args.productId} and provide a detailed forecast for the next ${args.forecastPeriods} periods.

Historical Data:
${args.historicalData}

Please provide:
1. A detailed analysis of the historical data patterns
2. The forecasted quantities for each period
3. Confidence intervals for the forecasts
4. Key assumptions and factors considered
5. Recommendations for inventory planning based on the forecast`
        }
      }]
    })
  );

  // Seasonal demand analysis prompt
  server.prompt(
    "analyze-seasonality",
    "Analyze seasonal patterns in sales data",
    {
      productId: z.string(),
      salesData: z.string()
    },
    (args) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `You are an expert in seasonal demand analysis. Analyze the provided sales data to identify seasonal patterns, trends, and anomalies.

Please analyze the seasonal patterns in the sales data for product ${args.productId}.

Sales Data:
${args.salesData}

Please provide:
1. Identification of seasonal patterns and cycles
2. Analysis of trend components
3. Detection of any anomalies or outliers
4. Recommendations for seasonal inventory planning
5. Suggestions for promotional timing based on seasonal patterns`
        }
      }]
    })
  );

  // Trend analysis prompt
  server.prompt(
    "analyze-trends",
    "Analyze sales trends and growth patterns",
    {
      productId: z.string(),
      historicalData: z.string()
    },
    (args) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `You are an expert in trend analysis. Analyze the provided data to identify long-term trends, growth patterns, and potential future developments.

Please analyze the trends in the data for product ${args.productId}.

Historical Data:
${args.historicalData}

Please provide:
1. Identification of long-term trends
2. Analysis of growth rates
3. Correlation between sales and other factors
4. Projection of future trends
5. Strategic recommendations based on trend analysis`
        }
      }]
    })
  );

  // Market impact analysis prompt
  server.prompt(
    "analyze-market-impact",
    "Analyze impact of market events on sales",
    {
      productId: z.string(),
      salesData: z.string()
    },
    (args) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `You are an expert in market impact analysis. Analyze how external market events and conditions affect product demand.

Please analyze the impact of market events on sales for product ${args.productId}.

Sales Data with Market Events:
${args.salesData}

Please provide:
1. Analysis of market event impacts
2. Identification of significant correlations
3. Assessment of market sensitivity
4. Recommendations for market-responsive inventory planning
5. Strategies for mitigating market volatility`
        }
      }]
    })
  );
} 