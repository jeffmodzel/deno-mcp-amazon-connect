import { Server } from 'npm:@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from 'npm:@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from 'npm:@modelcontextprotocol/sdk/types.js';
import { join, normalize, resolve } from "https://deno.land/std@0.208.0/path/mod.ts";
//import { existsSync } from "https://deno.land/std@0.208.0/fs/mod.ts";

import { TOOLS   } from './tools/mod.ts';

const ALLOWED_BASE_DIR = Deno.env.get("MCP_FILE_BASE_DIR") || "./data";

export class McpServer {
  private server: Server;
  private allowedBaseDir: string;

  constructor() {
    this.server = new Server(
      {
        name: "amazon-connect-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Resolve and normalize the base directory path
    this.allowedBaseDir = resolve(normalize(ALLOWED_BASE_DIR));
    
    //this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: TOOLS,
      };
    });
  }

  async run() {
    // Create stdio transport
    const transport = new StdioServerTransport();
    
    // Connect server to transport
    await this.server.connect(transport);
    
    //console.error(`MCP File & Weather Server running on stdio`);
    //console.error(`Allowed directory: ${this.allowedBaseDir}`);
    //console.error(`Weather API URL: ${WEATHER_API_URL}`);
  }

}
