export interface CALMManifest {
    nodes: Node[],
    relationships: Relationship[]
}

export interface Node {
    name: string, 
    class: string,
    uniqueId: string,
    'node-type': string,
    extras?: {[field: string]: unknown}
}

export type Relationship = InteractsRelationship | ConnectsRelationship | DeployedInRelationship | ComposedOfRelationship;

export interface InteractsRelationship {
    'relationship-type': 'interacts',
    uniqueId: string,
    parties: {
        actor: string,
        nodes: string[]
    }
}

export interface ConnectsRelationship {
    'relationship-type': 'connects',
    uniqueId: string,
    protocol: string,
    authentication: string,
    parties: {
        source: string,
        destination: string
    }
}

export interface DeployedInRelationship {
    'relationship-type': 'deployed-in',
    uniqueId: string,
    parties: {
        container: string,
        nodes: string[]
    }
}

export interface ComposedOfRelationship {
    'relationship-type': 'composed-of',
    uniqueId: string,
    parties: {
        container: string,
        nodes: string[]
    }
}