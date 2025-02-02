import { CalmNode, CalmItem, CalmConnectsRelationship, CalmInteractsRelationship, CalmDeployedInRelationship, CalmComposedOfRelationship, CalmMetadata } from './model';

function parseNodes(nodes: object[]): CalmNode[] {
    return nodes.map(node => {
        return new CalmNode(
            node['unique-id'],
            node['name'],
            node['description'],
            node['node-type'],
            node
        );
    });
}

function parseRelationships(relationships: object[]): CalmItem[] {
    return relationships.map(relationship => {
        if ('connects' in relationship['relationship-type']) {
            return new CalmConnectsRelationship(
                relationship['unique-id'],
                relationship['description'],
                relationship['relationship-type']['connects']['source']['node'],
                relationship['relationship-type']['connects']['destination']['node'],
                relationship
            );
        }

        if ('interacts' in relationship['relationship-type']) {
            return new CalmInteractsRelationship(
                relationship['unique-id'],
                relationship['description'],
                relationship['relationship-type']['interacts']['actor'],
                relationship['relationship-type']['interacts']['nodes'],
                relationship
            );
        }

        if ('deployed-in' in relationship['relationship-type']) {
            return new CalmDeployedInRelationship(
                relationship['unique-id'],
                relationship['description'],
                relationship['relationship-type']['deployed-in']['container'],
                relationship['relationship-type']['deployed-in']['nodes'],
                relationship
            );
        }

        if ('composed-of' in relationship['relationship-type']) {
            return new CalmComposedOfRelationship(
                relationship['unique-id'],
                relationship['description'],
                relationship['relationship-type']['composed-of']['container'],
                relationship['relationship-type']['composed-of']['nodes'],
                relationship
            );
        }
    });
}

function parseMetadata(metadata?: unknown[]): CalmMetadata[] {
    if (!metadata) return [];

    return metadata.map(field => new CalmMetadata(field));
}

function parseControls(_controls: object[]): CalmItem[] {
    return [];
}

function parseFlows(_flows: object[]): CalmItem[] {
    return [];
}

export function parse(calmArch: string): CalmItem[] {
    // assuming calmArch is valid CALM
    const calmObj = JSON.parse(calmArch);

    const items: CalmItem[] = [];
    
    items.push(...parseRelationships(calmObj.relationships));
    items.push(...parseNodes(calmObj.nodes));
    items.push(...parseMetadata(calmObj.metadata));
    items.push(...parseControls(calmObj.controls));
    items.push(...parseFlows(calmObj.flows));

    return items;
}