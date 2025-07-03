import { JSONPath } from 'jsonpath-plus';
import { RulesetFunctionContext } from '@stoplight/spectral-core';

/**
 * Checks that the given input, a unique ID, is referenced by at least one relationship.
 */
export function nodeHasRelationship(input: unknown, _: unknown, context: RulesetFunctionContext): Array<{message: string, path: (string | number)[]}> {
    // Type guard to ensure input is a string
    if (!input || typeof input !== 'string') {
        return [];
    }
    
    // Type guard for document data
    if (!context.document?.data || typeof context.document.data !== 'object') {
        return [];
    }
    
    const nodeName = input;

    const relationshipLabelsResult = JSONPath({path: '$.relationships[*].relationship-type..*@string()', json: context.document?.data as object});
    const relationshipLabels = Array.isArray(relationshipLabelsResult) ? relationshipLabelsResult as string[] : [];
    const results: Array<{message: string, path: (string | number)[]}> = [];
    
    if (relationshipLabels.length === 0) {
        return [{
            message: `Node with ID '${nodeName}' is not referenced by any relationships.`,
            path: [...context.path] as (string | number)[]
        }];
    }
    if (!relationshipLabels.includes(nodeName)) {
        results.push({
            message: `Node with ID '${nodeName}' is not referenced by any relationships.`,
            path: [...context.path] as (string | number)[]
        });
    }
    return results;
}