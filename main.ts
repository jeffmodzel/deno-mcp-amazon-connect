import { McpServer } from './src/mcp_server.ts';

// Run the server
if (import.meta.main) {
  const server = new McpServer();
  await server.run();
}
