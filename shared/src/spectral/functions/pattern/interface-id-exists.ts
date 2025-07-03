import { JSONPath } from 'jsonpath-plus';
import { RulesetFunctionContext } from '@stoplight/spectral-core';

/**
 * Checks that the input value exists as an interface with matching unique ID defined under a node in the document.
 */
export function interfaceIdExists(input: unknown, _: unknown, context: RulesetFunctionContext) {
    if (!input) {
        return [];
    }
    
    // Type guard to ensure input is a string
    if (typeof input !== 'string') {
        return [];
    }
    
    // Type guard for document data
    if (!context.document?.data || typeof context.document.data !== 'object') {
        return [];
    }
    
    // get uniqueIds of all interfaces - ensure we get an array
    const uniqueIdsResult = JSONPath({path: '$..interfaces.prefixItems[*].properties.unique-id.const', json: context.document.data as object});
    const uniqueIds = Array.isArray(uniqueIdsResult) ? uniqueIdsResult as string[] : [];
    const results: Array<{message: string, path: (string | number)[]}> = [];

    if (!uniqueIds.includes(input)) {
        results.push({
            message: `'${input}' does not refer to the unique-id of an existing interface.`,
            path: [...context.path]
        });
    }
    return results;
}