import { McpServer } from './src/mcp_server.ts';
import { logger, flushLogs } from './src/logger.ts';

if (import.meta.main) {
  logger.info(`MCP Server starting, running on stdio`);
  const server = new McpServer();
  await flushLogs();
  await server.run();
}
