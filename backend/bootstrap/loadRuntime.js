import { loadEnvironment } from './loadEnvironment.js';

/**
 * Server startup boundary. Environment is loaded before the HTTP and
 * database modules are evaluated, so their module-level configuration
 * cannot observe the pre-dotenv process.env state.
 */
export async function loadRuntimeModules(options = {}) {
  loadEnvironment(options);

  const [httpApp, databaseSchema] = await Promise.all([
    import('../httpApp.js'),
    import('../storage/databaseSchema.js')
  ]);

  return {
    buildHttpApp: httpApp.buildHttpApp,
    initializeDatabaseSchema: databaseSchema.initializeDatabaseSchema
  };
}
