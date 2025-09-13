// Tool definitions
export const TOOLS = [
  {
    name: 'get_connect_instance_metadata',
    description: 'Get metadata about an Amazon Connect instance',
    inputSchema: {
      type: 'object',
      properties: {
        friendlyName: {
          type: 'string',
          description: 'A friendly name given to an Amazon Connect instance. For example: "dev","qa","prod"',
        },
      },
      required: ['friendlyName'],
    },
  },
  {
    name: 'get_all_connect_instances_metadata',
    title: 'Get All Connect Instances',
    description: 'Get metadata about all available Amazon Connect instances',
    inputSchema: {
      'type': 'object',
      'properties': {},
      'required': [],
    },
    readonly: true
  },
  {
    name: 'get_weather_forecast',
    description: 'Get weather forecast for given coordinates',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: {
          type: 'number',
          description: 'Latitude coordinate',
          minimum: -90,
          maximum: 90,
        },
        longitude: {
          type: 'number',
          description: 'Longitude coordinate',
          minimum: -180,
          maximum: 180,
        },
      },
      required: ['latitude', 'longitude'],
    },
  },
];
