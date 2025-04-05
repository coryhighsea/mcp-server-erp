import express from 'express';
import cors from 'cors';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { inventoryResources } from './resources/inventory.js';
import { financialResources } from './resources/financial.js';
import { supplyChainResources } from './resources/supplyChain.js';
import { forecastingPrompts } from './prompts/forecasting.js';
import { costOptimizationPrompts } from './prompts/costOptimization.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
let port = parseInt(process.env.PORT || '3002', 10);
// Configure CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));
// Create MCP server
const server = new McpServer({
    name: "MCP Server",
    version: "1.0.0"
});
// Initialize resources
inventoryResources(server);
financialResources(server);
supplyChainResources(server);
// Initialize prompts
forecastingPrompts(server);
costOptimizationPrompts(server);
// Inspector endpoint
app.get('/inspector', async (req, res) => {
    try {
        const inspectorPath = join(__dirname, '..', 'node_modules', '@modelcontextprotocol', 'inspector', 'dist', 'index.html');
        const html = await readFile(inspectorPath, 'utf-8');
        res.send(html);
    }
    catch (err) {
        console.error('Error serving inspector:', err);
        res.status(500).send('Error loading inspector interface');
    }
});
// Start the server with STDIO transport
const startServer = async () => {
    try {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.log('MCP Server started with STDIO transport');
    }
    catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map