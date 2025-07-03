import { initLogger } from '@finos/calm-shared';
import { DocumentLoader } from '@finos/calm-shared/dist/document-loader/document-loader';

export async function loadPatternFromCalmHub(patternId: string, docLoader: DocumentLoader, debug: boolean): Promise<object> {
    const logger = initLogger(debug, 'calmhub-input');
    try {
        logger.info('Loading input pattern from CalmHub with ID: ' + patternId);

        const pattern = await docLoader.loadMissingDocument(patternId, 'pattern');

        logger.debug('Loaded pattern JSON.');
        return pattern;
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        const statusCode = err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'status' in err.response 
            ? err.response.status 
            : 'unknown';
        logger.error('Error loading input from CalmHub. Status code: ' + statusCode);
        logger.debug('Error loading input from CalmHub: ' + errorMessage);
        throw new Error(errorMessage);
    }
}