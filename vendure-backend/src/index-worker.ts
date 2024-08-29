import { bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';
import { dbSeeded, DbConnectionOptions } from './db-setup';

(async () => {
  const dbAlreadySeeded = await dbSeeded(config.dbConnectionOptions as DbConnectionOptions);
  const updatedConfig = {
    ...config,
    dbConnectionOptions: {
      ...config.dbConnectionOptions,
      synchronize: !dbAlreadySeeded,
    },
  };

  try {
    const worker = await bootstrapWorker(updatedConfig);
    worker.startJobQueue();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();