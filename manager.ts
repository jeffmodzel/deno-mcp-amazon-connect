import { logger, flushLogs } from './src/logger.ts';
import { AmazonConnectMetadataManager } from './src/manager/mod.ts';

console.log('********************');
console.log(' Development - running manager class');
console.log('********************');

// Run the server
if (import.meta.main) {
  logger.info(`in main()`);
  const m = new AmazonConnectMetadataManager('C:\\github\\deno-mcp-amazon-connect\\data');
  await m.loadMetadata();
  await flushLogs();
  console.log(m.getInstances());
}
