import { join, resolve } from 'https://deno.land/std@0.208.0/path/mod.ts';
import { logger } from '../logger.ts';

interface ConnectInstance {
  [key: string]: unknown;
}

export class AmazonConnectMetadataManager {
  private metadataDir: string;
  private instances: ConnectInstance[] = [];

  constructor(directoryPath: string) {
    logger.debug(`AmazonConnectMetadataManager.constructor()`);
    this.metadataDir = resolve(directoryPath);
    logger.debug(`AmazonConnectMetadataManager initialized with directory: ${this.metadataDir}`);
  }

  async loadMetadata(): Promise<void> {
    logger.debug(`AmazonConnectMetadataManager.loadMetadata()`);
    this.instances = [];

    for await (const dirEntry of Deno.readDir(this.metadataDir)) {
      if (dirEntry.isDirectory) {
        const instancePath = join(this.metadataDir, dirEntry.name, 'instance.json');
        try {
          const instanceData = await Deno.readTextFile(instancePath);
          const instance = JSON.parse(instanceData) as ConnectInstance;
          instance['friendlyName'] = dirEntry.name;
          this.instances.push(instance);
          logger.debug(`Loaded instance from ${dirEntry.name}`);
        } catch (error) {
          logger.debug(
            `Failed to load instance from ${dirEntry.name}: ${error}`,
          );
        }
      }
    }
  }

  getInstances(): ConnectInstance[] {
    logger.debug(`AmazonConnectMetadataManager.getInstances()`);
    //logger.debug(`AmazonConnectMetadataManager.getInstances()`);
    
    return this.instances;
  }
}
