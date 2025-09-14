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
import { flushLogs, logger } from './logger.ts';
import { AmazonConnectMetadataManager } from './manager/mod.ts';

const DATA_FOLDER = Deno.env.get('MCP_DATA_FOLDER') || 'C:\\github\\deno-mcp-amazon-connect\\data';

export class McpServer {
  private server: Server;
  private manager: AmazonConnectMetadataManager;

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

    this.manager = new AmazonConnectMetadataManager(DATA_FOLDER);
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
          case 'get_all_connect_instances_metadata':
            return await this.handleGetAllConnectInstanceMetadata(args);
          case 'get_contact_flow_metadata':
            return await this.handleGetContactFlowMetadata(args);
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
    await this.manager.loadMetadata();

    // Create stdio transport
    const transport = new StdioServerTransport();
    // Connect server to transport
    await this.server.connect(transport);
  }

  private async handleGetConnectInstanceMetadata(args: any) {
    logger.debug('McpServer.handleGetConnectInstanceMetadata()');
    await flushLogs();

    const { friendlyName } = args;

    let responseText = 'No Connect Instance available';
    if (friendlyName === 'dev') {
      responseText = 'dev Connect Instance ARN is arn:1234:qwerty, Account ID: 987654321';
    }
    if (friendlyName === 'prod') {
      responseText = 'prod Connect Instance ARN is arn:554433:azazaz, Account ID: 1122334455';
    }

    return {
      content: [
        {
          type: 'text',
          text: responseText,
        },
      ],
    };

    //throw new Error('Method not implemented: McpServer.handleGetConnectInstanceMetadata()');
  }

  private async handleGetAllConnectInstanceMetadata(args: any) {
    logger.debug('McpServer.handleGetAllConnectInstanceMetadata()');
    logger.debug(`args: ${JSON.stringify(args)}`);
    await flushLogs();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(this.manager.getInstances()),
        },
      ],
    };
  }

  private handleGetContactFlowMetadata(args: any) {
    logger.debug('McpServer.handleGetContactFlowMetadata()');

    const { Arn } = args;

    let responseText = 'Contact Flow not found.';
    const found = this.manager.getContactFlow(Arn);
    if (found) {
      responseText = JSON.stringify(found);
    }

    return {
      content: [
        {
          type: 'text',
          text: responseText,
        },
      ],
    };

  }
}
