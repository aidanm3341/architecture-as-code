import { JSONPath } from 'jsonpath-plus';
import { difference } from 'lodash';
import { RulesetFunctionContext } from '@stoplight/spectral-core';

/**
 * Checks that the input value exists as an interface with matching unique ID defined under a node in the document.
 */
export function interfaceIdExistsOnNode(input: any, _: unknown, context: RulesetFunctionContext): Array<{message: string, path: (string | number)[]}>  {
    if (!input || !input.interfaces) {
        return [];
    }

    if (!input.node) {
        return [{
            message: 'Invalid connects relationship - no node defined.',
            path: [...context.path]
        }];
    }

    // Type guard for document data
    if (!context.document?.data || typeof context.document.data !== 'object') {
        return [];
    }

    const nodeId = input.node;
    const nodesResult = JSONPath({ path: '$.properties.nodes.prefixItems[*]', json: context.document.data as object });
    const nodes: object[] = Array.isArray(nodesResult) ? nodesResult : [];
    const node = nodes.find((node) => {
        const uniqueIdResult = JSONPath({ path: '$.properties.unique-id.const', json: node });
        const uniqueId: string[] = Array.isArray(uniqueIdResult) ? uniqueIdResult : [];
        const oneOfResult = JSONPath({ path: '$.oneOf[*].properties.unique-id.const', json: node });
        const anyOfResult = JSONPath({ path: '$.anyOf[*].properties.unique-id.const', json: node });
        uniqueId.push(...(Array.isArray(oneOfResult) ? oneOfResult : []));
        uniqueId.push(...(Array.isArray(anyOfResult) ? anyOfResult : []));
        return uniqueId && uniqueId[0] === nodeId;
    });
    if (!node) {
        // other rule will report undefined node
        return [];
    }

    // all of these must be present on the referenced node
    const desiredInterfaces = input.interfaces;

    const nodeInterfacesResult = JSONPath({ path: '$.properties.interfaces.prefixItems[*].properties.unique-id.const', json: node });
    const nodeInterfaces: string[] = Array.isArray(nodeInterfacesResult) ? nodeInterfacesResult : [];
    const oneOfInterfacesResult = JSONPath({ path: '$.oneOf[*].properties.interfaces.prefixItems[*].properties.unique-id.const', json: node });
    const anyOfInterfacesResult = JSONPath({ path: '$.anyOf[*].properties.interfaces.prefixItems[*].properties.unique-id.const', json: node });
    nodeInterfaces.push(...(Array.isArray(oneOfInterfacesResult) ? oneOfInterfacesResult : []));
    nodeInterfaces.push(...(Array.isArray(anyOfInterfacesResult) ? anyOfInterfacesResult : []));
    if (!nodeInterfaces || nodeInterfaces.length === 0) {
        return [
            { message: `Node with unique-id ${nodeId} has no interfaces defined, expected interfaces [${desiredInterfaces}]`, path: [...context.path] as (string | number)[] }
        ];
    }

    const missingInterfaces = difference(desiredInterfaces, nodeInterfaces);

    //difference always returns an array
    if (missingInterfaces.length === 0) {
        return [];
    }
    const results: Array<{message: string, path: (string | number)[]}> = [];

    for (const missing of missingInterfaces) {
        results.push({
            message: `Referenced interface with ID '${missing}' was not defined on the node with ID '${nodeId}'.`,
            path: [...context.path]
        });
    }
    return results;
}