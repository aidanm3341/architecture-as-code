import * as fs from 'node:fs';
import * as path from 'node:path';
import { mkdirp } from 'mkdirp';

import { CalmChoice, selectChoices, type SchemaPropertyBase } from './components/options.js';
import { instantiate } from './components/instantiate';
import { initLogger } from '../../logger.js';
import { SchemaDirectory } from '../../schema-directory.js';

export async function runGenerate(pattern: SchemaPropertyBase, outputPath: string, debug: boolean, schemaDirectory: SchemaDirectory, chosenChoices?: CalmChoice[]): Promise<void> {
    const logger = initLogger(debug, 'calm-generate');
    logger.info('Generating a CALM architecture...');
    try {
        if (chosenChoices) {
            pattern = selectChoices(pattern, chosenChoices, debug);
        }

        const final = await instantiate(pattern, debug, schemaDirectory);
        const output = JSON.stringify(final, null, 2);
        const dirname = path.dirname(outputPath);

        mkdirp.sync(dirname);
        fs.writeFileSync(outputPath, output);
        logger.info(`Successfully generated architecture to [${outputPath}]`);
    } catch (err) {
        const error = err as Error;
        logger.error('Error while generating architecture from pattern: ' + error.message);
        if (error.stack) {
            logger.debug(error.stack);
        }
    }
}
