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

  let found = m.getContactFlow('arn:aws:connect:us-east-1:640752219712:instance/587c546e-2328-4c36-baa2-37eaf4749631/contact-flow/a736dc0b-acf2-4ff1-8639-fcc1be32275c');

  if (found) {
    console.log(found);
  } else {
    console.log('not found');
  }
  
}
