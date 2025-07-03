import { JSONPath } from 'jsonpath-plus';
import { detectDuplicates } from '../helper-functions';

/**
 * Checks that the input value exists as a node with a matching unique ID.
 */
export function idsAreUnique(input: unknown, _: unknown, context: {document: {data: unknown}}) {
    if (!input) {
        return [];
    }
    // get uniqueIds of all nodes
    const jsonData = context.document.data as any;
    const nodeIdMatches = JSONPath({path: '$.nodes[*].unique-id', json: jsonData, resultType: 'all'});
    const relationshipIdMatches = JSONPath({path: '$.relationships[*].unique-id', json: jsonData, resultType: 'all'});
    const interfaceIdMatches = JSONPath({path: '$.nodes[*].interfaces[*].unique-id', json: jsonData, resultType: 'all'});

    const seenIds = new Set<string>();

    const messages: Array<{message: string, path: string[]}> = [];

    detectDuplicates(nodeIdMatches as Array<{value: string, pointer: string}>, seenIds, messages);
    detectDuplicates(relationshipIdMatches as Array<{value: string, pointer: string}>, seenIds, messages);
    detectDuplicates(interfaceIdMatches as Array<{value: string, pointer: string}>, seenIds, messages);

    return messages;
};