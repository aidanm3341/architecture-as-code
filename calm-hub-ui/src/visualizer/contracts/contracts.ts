import { CalmInterfaceSchema } from '@finos/calm-shared/src/types/core-types.js';
import { CalmControlsSchema } from '@finos/calm-shared/src/types/control-types.js';

// Legacy Cytoscape types for backward compatibility
export type CytoscapeNode = {
    classes?: string;
    data: CytoscapeNodeData & {
        cytoscapeProps: {
            labelWithDescription: string;
            labelWithoutDescription: string;
        };
    };
};

export type CytoscapeNodeData = {
    id: string;
    description: string;
    type: string;
    name: string;
    interfaces?: CalmInterfaceSchema[];
    controls?: CalmControlsSchema;
    parent?: string;
};

// ReactFlow types
export type ReactFlowNode = {
    data: ReactFlowNodeData & {
        reactFlowProps: {
            labelWithDescription: string;
            labelWithoutDescription: string;
        };
    };
    position?: { x: number; y: number };
};

export type ReactFlowNodeData = {
    id: string;
    description: string;
    type: string;
    name: string;
    interfaces?: CalmInterfaceSchema[];
    controls?: CalmControlsSchema;
    parent?: string;
    parentRelationshipType?: 'composed-of' | 'deployed-in';
};

export type ReactFlowEdge = {
    data: {
        id: string;
        label: string;
        source: string;
        target: string;
        relationshipType?: string;
        [idx: string]: string | undefined;
    };
};

// Shared Edge type (works for both Cytoscape and ReactFlow)
export type Edge = {
    data: {
        id: string;
        label: string;
        source: string;
        target: string;
        [idx: string]: string;
    };
};

export type IdAndPosition = {
    nodeId?: string;
    id?: string;
    position: { x: number; y: number };
};
