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
    'relationship-type': {
        'interacts': {
            actor: string,
            nodes: string[]
        }
    },
    uniqueId: string,
}

export interface ConnectsRelationship {
    'relationship-type': {
        'connects': {
            source: string,
            destination: string
        }
    },
    uniqueId: string,
    protocol: string,
    authentication: string,
}

export interface DeployedInRelationship {
    'relationship-type': {
        'deployed-in': {
            container: string,
            nodes: string[]
        }
    },
    uniqueId: string,
}

export interface ComposedOfRelationship {
    'relationship-type': {
        'composed-of': {
            container: string,
            nodes: string[]
        },
    }
    uniqueId: string,
}