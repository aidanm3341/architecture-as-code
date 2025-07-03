import { JSONPath } from 'jsonpath-plus';
import { RulesetFunctionContext } from '@stoplight/spectral-core';
/**
 * Checks that the input value should be defined in a oneOf or anyOf block.
 */
export function isDefinedInOneOfOrAnyOf(input: unknown, { calmType }: { calmType: 'nodes' | 'relationships'}, context: RulesetFunctionContext) {
    if (!input || typeof input !== 'string') {
        return [];
    }

    // Type guard for document data
    if (!context.document?.data || typeof context.document.data !== 'object') {
        return [];
    }

    const namesResult = JSONPath({ path: `$.properties.${calmType}.prefixItems[*].properties.unique-id.const`, json: context.document.data as object });
    const oneofsResult = JSONPath({ path: `$.properties.${calmType}.prefixItems[*].oneOf[*].properties.unique-id.const`, json: context.document.data as object });
    const anyofsResult = JSONPath({ path: `$.properties.${calmType}.prefixItems[*].anyOf[*].properties.unique-id.const`, json: context.document.data as object });
    
    const names = Array.isArray(namesResult) ? namesResult as string[] : [];
    const oneofs = Array.isArray(oneofsResult) ? oneofsResult as string[] : [];
    const anyofs = Array.isArray(anyofsResult) ? anyofsResult as string[] : [];

    const results: Array<{message: string, path: (string | number)[]}> = [];

    if (names.includes(input) && !oneofs.includes(input) && !anyofs.includes(input)) {
        results.push({
            message: `'${input}' is part of a pattern option and must be defined in a oneOf or anyOf block.`,
            path: [...context.path],
        });
    }
    return results;
};
