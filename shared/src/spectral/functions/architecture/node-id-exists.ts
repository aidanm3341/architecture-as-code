import { JSONPath } from 'jsonpath-plus';
import { RulesetFunctionContext } from '@stoplight/spectral-core';

/**
 * Checks that the input value exists as a node with a matching unique ID.
 */
export function nodeIdExists(input: unknown, _: unknown, context: RulesetFunctionContext) {
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
    
    // get uniqueIds of all nodes
    const namesResult = JSONPath({path: '$.nodes[*].unique-id', json: context.document.data as object});
    const names = Array.isArray(namesResult) ? namesResult as string[] : [];
    const results: Array<{message: string, path: (string | number)[]}> = [];

    if (!names.includes(input)) {
        results.push({
            message: `'${input}' does not refer to the unique-id of an existing node.`,
            path: [...context.path]
        });
    }
    return results;
}