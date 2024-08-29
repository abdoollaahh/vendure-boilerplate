import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

(async () => {
    console.log('index.ts');
    runMigrations(config)
    .then(() => bootstrap(config))
    .catch(err => {
        console.log(err);
    });
})();