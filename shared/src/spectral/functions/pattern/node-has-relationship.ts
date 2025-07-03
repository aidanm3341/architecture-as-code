import { JSONPath } from 'jsonpath-plus';
import { RulesetFunctionContext } from '@stoplight/spectral-core';

/**
 * Checks that the given input, a unique ID, is referenced by at least one relationship.
 */
export default (input: unknown, _: unknown, context: RulesetFunctionContext): Array<{message: string, path: (string | number)[]}>  => {
    // Type guard to ensure input is a string
    if (!input || typeof input !== 'string') {
        return [];
    }
    
    // Type guard for document data
    if (!context.document?.data || typeof context.document.data !== 'object') {
        return [];
    }
    
    const nodeId = input;

    const referencedNodeIdsResult = JSONPath({path: '$..relationship-type..*@string()', json: context.document.data as object});
    const referencedNodeIds = Array.isArray(referencedNodeIdsResult) ? referencedNodeIdsResult as string[] : [];

    const results: Array<{message: string, path: (string | number)[]}> = [];
    if (referencedNodeIds.length === 0) {
        return [{
            message: `Node with ID '${nodeId}' is not referenced by any relationships.`,
            path: [...context.path]
        }];
    }
    if (!referencedNodeIds.includes(nodeId)) {
        results.push({
            message: `Node with ID '${nodeId}' is not referenced by any relationships.`,
            path: [...context.path]
        });
    }
    return results;
};