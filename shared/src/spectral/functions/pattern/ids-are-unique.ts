import { JSONPath } from 'jsonpath-plus';
import { detectDuplicates } from '../helper-functions';
/**
 * Checks that the input value exists as a node with a matching unique ID.
 */
export default (input: unknown, _: unknown, context: {document: {data: unknown}}) => {
    if (!input) {
        return [];
    }
    
    // Type guard for document data
    if (!context.document.data || typeof context.document.data !== 'object') {
        return [];
    }
    
    // get uniqueIds of all nodes - ensure we get proper result type
    const nodeIdMatches = JSONPath({path: '$.properties.nodes.prefixItems[*].properties.unique-id.const', json: context.document.data as object, resultType: 'all'}) as Array<{value: string, pointer: string}>;
    const relationshipIdMatches = JSONPath({path: '$.properties.relationships.prefixItems[*].properties.unique-id.const', json: context.document.data as object, resultType: 'all'}) as Array<{value: string, pointer: string}>;
    const interfaceIdMatches = JSONPath({path: '$.properties.nodes.prefixItems[*].properties.interfaces.prefixItems[*].properties.unique-id.const', json: context.document.data as object, resultType: 'all'}) as Array<{value: string, pointer: string}>;

    const seenIds = new Set<string>();

    const messages: Array<{message: string, path: string[]}> = [];

    detectDuplicates(nodeIdMatches, seenIds, messages);
    detectDuplicates(relationshipIdMatches, seenIds, messages);
    detectDuplicates(interfaceIdMatches, seenIds, messages);

    return messages;
};