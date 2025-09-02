
// Tool definitions
export const TOOLS = [
    {
      name: "read_file",
      description: "Read the contents of a text file from the allowed directory",
      inputSchema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Relative path to the file within the allowed directory",
          },
        },
        required: ["path"],
      },
    },
    {
      name: "get_weather_forecast",
      description: "Get weather forecast for given coordinates",
      inputSchema: {
        type: "object",
        properties: {
          latitude: {
            type: "number",
            description: "Latitude coordinate",
            minimum: -90,
            maximum: 90,
          },
          longitude: {
            type: "number",
            description: "Longitude coordinate",
            minimum: -180,
            maximum: 180,
          },
        },
        required: ["latitude", "longitude"],
      },
    },
  ];