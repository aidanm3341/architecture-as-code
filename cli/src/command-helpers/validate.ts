
import { getFormattedOutput, validate, exitBasedOffOfValidationOutcome, OutputFormat } from '@finos/calm-shared';
import { initLogger } from '@finos/calm-shared';
import path from 'path';
import { mkdirp } from 'mkdirp';
import { writeFileSync } from 'fs';
import {Command} from 'commander';

interface ValidateOptions {
    architecture?: string;
    pattern?: string;
    schemaDirectory: string;
    verbose: boolean;
    format: OutputFormat;
    output?: string;
    strict: boolean;
}

export async function runValidate(options: ValidateOptions) {

    try {
        // Either architecture or pattern must be provided (enforced by checkValidateOptions)
        const architecture = options.architecture || '';
        const pattern = options.pattern || '';
        const outcome = await validate(architecture, pattern, options.schemaDirectory, options.verbose);
        const content = getFormattedOutput(outcome, options.format);
        writeOutputFile(options.output, content);
        exitBasedOffOfValidationOutcome(outcome, options.strict);
    }
    catch (err) {
        const logger = initLogger(options.verbose, 'calm-validate');
        const errorMessage = err instanceof Error ? err.message : String(err);
        const errorStack = err instanceof Error ? err.stack : undefined;
        logger.error('An error occurred while validating: ' + errorMessage);
        if (errorStack) {
            logger.debug(errorStack);
        }
        process.exit(1);
    }
}


export function writeOutputFile(output: string | undefined, validationsOutput: string) {
    if (output) {
        const dirname = path.dirname(output);
        mkdirp.sync(dirname);
        writeFileSync(output, validationsOutput);
    } else {
        process.stdout.write(validationsOutput);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkValidateOptions(program: Command, options: any, patternOption: string, architectureOption: string) {
    if (!options.pattern && !options.architecture) {
        program.error(`error: one of the required options '${patternOption}' or '${architectureOption}' was not specified`);
    }
}