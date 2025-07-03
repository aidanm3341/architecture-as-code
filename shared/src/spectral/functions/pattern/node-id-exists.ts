import { JSONPath } from 'jsonpath-plus';
import { RulesetFunctionContext } from '@stoplight/spectral-core';
/**
 * Checks that the input value exists as a node with a matching unique ID.
 */
export default (input: unknown, _: unknown, context: RulesetFunctionContext) => {
    if (!input || typeof input !== 'string') {
        return [];
    }

    // Type guard for document data
    if (!context.document?.data || typeof context.document.data !== 'object') {
        return [];
    }

    const namesResult = JSONPath({ path: '$.properties.nodes.prefixItems[*].properties.unique-id.const', json: context.document.data as object });
    const oneofsResult = JSONPath({ path: '$.properties.nodes.prefixItems[*].oneOf[*].properties.unique-id.const', json: context.document.data as object });
    const anyofsResult = JSONPath({ path: '$.properties.nodes.prefixItems[*].anyOf[*].properties.unique-id.const', json: context.document.data as object });
    
    const names = Array.isArray(namesResult) ? namesResult as string[] : [];
    const oneofs = Array.isArray(oneofsResult) ? oneofsResult as string[] : [];
    const anyofs = Array.isArray(anyofsResult) ? anyofsResult as string[] : [];

    // get uniqueIds of all nodes
    const results: Array<{message: string, path: (string | number)[]}> = [];

    if (!names.includes(input) && !oneofs.includes(input) && !anyofs.includes(input)) {
        results.push({
            message: `'${input}' does not refer to the unique-id of an existing node.`,
            path: [...context.path],
        });
    }
    return results;
};
