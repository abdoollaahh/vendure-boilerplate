import { DataSource } from 'typeorm';


export const dbSeeded = async (dbConfig: DbConnectionOptions): Promise<boolean> => {
  console.log('Checking if database has been seeded...');
  try {
    const dataSource = new DataSource(dbConfig);

    await dataSource.initialize();

    const queryRunner = dataSource.createQueryRunner();

    // Check if a specific table exists that is created during seeding
    const tableExists = await queryRunner.hasTable('migrations');

    // Alternatively, you can check for the presence of a specific record
    // const recordExists = await queryRunner.manager.findOne(YourEntity, { /* condition */ });

    await queryRunner.release();
    await dataSource.destroy();

    console.log('Database seeded:', tableExists);

    return tableExists;
  } catch (error) {
    console.error('Error checking if database has been seeded:', error);
    return false;
  }
};

export interface DbConnectionOptions {
  type: "oracle" | "postgres";
  synchronize: boolean;
  migrations: string[];
  logging: boolean;
  database: string | undefined;
  schema: string | undefined;
  host: string | undefined;
  port: number | undefined;
  username: string | undefined;
  password: string | undefined;
}
