import path from 'path';
import axios from 'axios';
import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';
import { dbSeeded, DbConnectionOptions } from './db-setup';
import { populate } from '@vendure/core/cli';

const seedDb =async () => {
  const dbAlreadySeeded = await dbSeeded(config.dbConnectionOptions as DbConnectionOptions);
  if (dbAlreadySeeded) {
    console.log('Database already seeded, skipping...');
    process.exit(0);
  }
  const updatedConfig = {
    ...config,
    dbConnectionOptions: {
      ...config.dbConnectionOptions,
      synchronize: !dbAlreadySeeded,
    },
  };
  
  try {
    const initialDataPath = path.join(require.resolve('@vendure/create'), '../assets/initial-data.json');
    const app = await populate(() => bootstrap(updatedConfig), require(initialDataPath));
    await app.close();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const reportDeploy = async () => {
  const url = process.env.TEMPLATE_REPORTER_URL;
  if (!url) {
    return;
  }
  const projectId = process.env.RAILWAY_PROJECT_ID;
  const templateId = 'vendure';
  const payload = { projectId, templateId };
  try {
      await axios.post(`${url}/api/projectDeployed`, payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
  } catch (error) {
      console.error(`An error occurred: ${(error as any).message}`);
  }
};

seedDb();
reportDeploy();