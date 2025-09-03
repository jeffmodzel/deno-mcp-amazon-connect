import { Server } from 'npm:@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from 'npm:@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from 'npm:@modelcontextprotocol/sdk/types.js';
import { join, normalize, resolve } from 'https://deno.land/std@0.208.0/path/mod.ts';
//import { existsSync } from "https://deno.land/std@0.208.0/fs/mod.ts";

import { TOOLS } from './tools/mod.ts';
import { logger } from './logger.ts';

//const ALLOWED_BASE_DIR = Deno.env.get("MCP_FILE_BASE_DIR") || "./data";

export class McpServer {
  private server: Server;
  //private allowedBaseDir: string;

  constructor() {
    logger.debug('McpServer.constructor()');
    this.server = new Server(
      {
        name: 'amazon-connect-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    // Resolve and normalize the base directory path
    //this.allowedBaseDir = resolve(normalize(ALLOWED_BASE_DIR));

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    logger.debug('McpServer.setupToolHandlers()');

    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: TOOLS,
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_connect_instance_metadata':
            return await this.handleGetConnectInstanceMetadata(args);
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        // Handle errors
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Error handling tool call: ${errorMessage}`);
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${errorMessage}`);
      }
    });
  }

  async run() {
    logger.debug('McpServer.run()');
    // Create stdio transport
    const transport = new StdioServerTransport();
    // Connect server to transport
    await this.server.connect(transport);
  }

  private async handleGetConnectInstanceMetadata(args: any) {
    logger.debug('McpServer.handleGetConnectInstanceMetadata()');
    const { friendlyName } = args;

    return {
      content: [
        {
          type: "text",
          text: `Not Implemented`,
        },
      ],
    };

    //throw new Error('Method not implemented: McpServer.handleGetConnectInstanceMetadata()');
  }
}
