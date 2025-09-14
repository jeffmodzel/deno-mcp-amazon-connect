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
    description: 'Get metadata about all available Amazon Connect instances, including basic information about Contact Flows.',
    inputSchema: {
      'type': 'object',
      'properties': {},
      'required': [],
    },
    readonly: true
  },
  {
    name: 'get_contact_flow_metadata',
    description: 'Get full metadata in JSON format about a Contact Flow',
    inputSchema: {
      type: 'object',
      properties: {
        Arn: {
          type: 'string',
          description: 'The ARN (Amazon Resource Name) of the Contact Flow',
        }
      },
      required: ['Arn'],
    },
    readonly: true
  }
];
