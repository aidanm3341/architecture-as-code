import express, { Application } from 'express';
import { CLIServerRoutes } from './routes/routes';
import { initLogger, SchemaDirectory } from '@finos/calm-shared';

export function startServer(port: string, schemaDirectoryPath: string, schemaDirectory: SchemaDirectory, verbose: boolean) {
    const app: Application = express();
    const cliServerRoutesInstance = new CLIServerRoutes(schemaDirectoryPath, schemaDirectory, verbose);
    const allRoutes = cliServerRoutesInstance.router;

    app.use(express.json());
    app.use('/', allRoutes);

    app.listen(port, () => {
        const logger = initLogger(verbose, 'calm-server');
        logger.info(`CALM Server is running on http://localhost:${port}`);
    });
}