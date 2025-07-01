import { Node, Edge, NodeChange, OnNodesChange } from 'reactflow';
import { ReactFlowNode, ReactFlowEdge } from '../../../contracts/contracts.js';
import { saveNodePositions } from '../../../services/node-position-service.js';
import { convertNodesToReactFlow } from './nodeConversion.js';
import { convertEdgesToReactFlow } from './edgeConversion.js';

export interface DragHandlerParams {
    changes: NodeChange[];
    onNodesChange: OnNodesChange;
    reactFlowNodes: Node[];
    calmKey: string;
    nodes: ReactFlowNode[];
    edges: ReactFlowEdge[];
    isRelationshipDescActive: boolean;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
}

export function createDragHandler({
    changes,
    onNodesChange,
    reactFlowNodes,
    calmKey,
    nodes,
    edges,
    isRelationshipDescActive,
    setNodes,
    setEdges,
}: DragHandlerParams) {
    onNodesChange(changes);
    
    // Only save positions after drag ends to avoid jittery behavior during drag
    const dragEndChanges = changes.filter((change) => 
        change.type === 'position' && 
        'dragging' in change && 
        change.dragging === false
    );
    
    if (dragEndChanges.length > 0) {
        setTimeout(() => {
            const currentNodes = reactFlowNodes;
            const nodePositions = currentNodes.map((node) => ({
                id: node.id,
                position: node.position,
            }));
            saveNodePositions(calmKey, nodePositions);
            
            // Recalculate group sizes and edge anchor points only after drag ends
            const inputNodes = nodes; // Use original input nodes
            const currentPositions = nodePositions;
            const updatedNodes = convertNodesToReactFlow(inputNodes, true, currentPositions);
            
            // Apply current positions to updated nodes
            updatedNodes.forEach((node) => {
                const currentPos = currentPositions.find((pos) => pos.id === node.id);
                if (currentPos) {
                    node.position = currentPos.position;
                }
            });
            
            // Recalculate edge anchor points with new node positions
            const updatedEdges = convertEdgesToReactFlow(edges, updatedNodes, isRelationshipDescActive);
            
            setNodes(updatedNodes);
            setEdges(updatedEdges);
        }, 100);
    }
}