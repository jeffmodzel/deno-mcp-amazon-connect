# deno-mcp-amazon-connect

MCP Amazon Connect metadata server written in Deno/TypeScript


## Environment variables

SET ALLOW_CONSOLE_LOGGING=TRUE

## Rules examples

https://aws.amazon.com/blogs/devops/mastering-amazon-q-developer-with-rules/

## Deno Style Guide

https://docs.deno.com/runtime/contributing/style_guide/



C:\github\deno-mcp-amazon-connect\start_mcp_server.cmd

# Claude for Desktop

Lesson learned - console.log causes problems because it hits stdio.  Need to `@echo off` 

Claude for Desktop config
```
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["C:\\PATH\\TO\\PARENT\\FOLDER\\weather\\build\\index.js"]
    }
  }
}

{
  "mcpServers": {
    "weather": {
      "command": "C:\\github\\deno-mcp-amazon-connect\\start_mcp_server.cmd",
    }
  }
}


{
  "mcpServers": {
    "server-name": {
      "command": "command-to-run",
      "args": ["argument1", "argument2"],
      "env": {
        "ENVIRONMENT_VARIABLE": "value"
      }
    }
  }
}

{
  "mcpServers": {
    "server-name": {
      "command": "deno",
      "args": ["run", "--allow-all", "C:\\github\\deno-mcp-amazon-connect\\main.ts"]
    }
  }
}

```
deno run --allow-all main.ts




This works in Claude Desktop
connect
running

Command
deno

Arguments
run --allow-all C:\github\deno-mcp-amazon-connect\main.ts