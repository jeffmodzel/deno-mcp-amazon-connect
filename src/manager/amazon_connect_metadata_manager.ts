import { join, resolve } from 'https://deno.land/std@0.208.0/path/mod.ts';
import { logger } from '../logger.ts';

interface ContactFlowBasic {
  Name: string;
  Id: string;
  Arn: string;
}

interface ContactFlow {
  [key: string]: unknown;
}

interface ConnectInstance {
  [key: string]: unknown;
  contactFlows?: ContactFlowBasic[];
}

export class AmazonConnectMetadataManager {
  private metadataDir: string;
  private instances: ConnectInstance[] = [];
  private allContactFlows: ContactFlow[] = [];

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

          // Load ContactFlows
          const contactFlowsDir = join(this.metadataDir, dirEntry.name, 'ContactFlows');
          instance.contactFlows = await this.loadContactFlowsBasic(contactFlowsDir);
          this.allContactFlows = await this.loadContactFlows(contactFlowsDir);

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

  private async loadContactFlowsBasic(contactFlowsDir: string): Promise<ContactFlowBasic[]> {
    logger.debug(`AmazonConnectMetadataManager.loadContactFlowsBasic()`);
    const contactFlows: ContactFlowBasic[] = [];

    try {
      for await (const entry of Deno.readDir(contactFlowsDir)) {
        if (entry.isFile && entry.name.endsWith('.json')) {
          const filePath = join(contactFlowsDir, entry.name);
          try {
            const fileData = await Deno.readTextFile(filePath);
            const parsedData = JSON.parse(fileData);
            contactFlows.push({Name: parsedData.Name, Id: parsedData.Id, Arn: parsedData.Arn});
            logger.debug(`Loaded ContactFlow: ${entry.name}`);
          } catch (error) {
            logger.debug(`Failed to load ContactFlow ${entry.name}: ${error}`);
          }
        }
      }
    } catch (error) {
      logger.debug(`ContactFlows directory not found or inaccessible: ${error}`);
    }
    return contactFlows;
  }

  private async loadContactFlows(contactFlowsDir: string): Promise<ContactFlow[]> {
    logger.debug(`AmazonConnectMetadataManager.loadContactFlows()`);
    const contactFlows: ContactFlow[] = [];

    try {
      for await (const entry of Deno.readDir(contactFlowsDir)) {
        if (entry.isFile && entry.name.endsWith('.json')) {
          const filePath = join(contactFlowsDir, entry.name);
          try {
            const fileData = await Deno.readTextFile(filePath);
            const contactFlow = JSON.parse(fileData) as ContactFlow;
            contactFlows.push(contactFlow);
            logger.debug(`Loaded ContactFlow: ${entry.name}`);
          } catch (error) {
            logger.debug(`Failed to load ContactFlow ${entry.name}: ${error}`);
          }
        }
      }
    } catch (error) {
      logger.debug(`ContactFlows directory not found or inaccessible: ${error}`);
    }

    return contactFlows;
  }

  public getInstances(): ConnectInstance[] {
    logger.debug(`AmazonConnectMetadataManager.getInstances()`);
    return this.instances;
  }

  public getContactFlow(arn: string): ContactFlow | undefined {
    logger.debug(`AmazonConnectMetadataManager.getContactFlow()`);
    return this.allContactFlows.find((contactFlow) => contactFlow.Arn === arn);
  }
}
