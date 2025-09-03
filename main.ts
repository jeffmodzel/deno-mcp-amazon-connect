import { McpServer } from './src/mcp_server.ts';
import { logger } from './src/logger.ts';

console.log(`Log level: ${logger.levelName}`);

// Run the server
if (import.meta.main) {
  logger.info(`MCP File & Weather Server running on stdio`);
  const server = new McpServer();
  await server.run();
}
