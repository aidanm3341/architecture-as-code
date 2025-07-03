import './reactflow.css';
import { useCallback, useEffect, useState } from 'react';
import {
    ReactFlow,
    Node,
    Edge,
    Controls,
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    ConnectionMode,
    MiniMap,
    SelectionMode,
    ConnectionLineType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ReactFlowNode, ReactFlowEdge } from '../../contracts/contracts.js';
import {
    saveNodePositions,
    loadStoredNodePositions,
} from '../../services/node-position-service.js';
import CustomNode from './components/CustomNode.js';
import { GroupOverlay } from './components/GroupOverlay.js';
import { convertNodesToReactFlow } from './utils/nodeConversion.js';
import { convertEdgesToReactFlow } from './utils/edgeConversion.js';

interface GroupData {
    id: string;
    label: string;
    description?: string;
    type: 'composed-of' | 'deployed-in';
    memberNodeIds: string[];
}

export interface ReactFlowRendererProps {
    isNodeDescActive: boolean;
    isRelationshipDescActive: boolean;
    nodes: ReactFlowNode[];
    edges: ReactFlowEdge[];
    groups?: GroupData[];
    nodeClickedCallback: (x: ReactFlowNode['data'] | ReactFlowEdge['data']) => void;
    edgeClickedCallback: (x: ReactFlowNode['data'] | ReactFlowEdge['data']) => void;
    calmKey: string;
}

const nodeTypes = {
    custom: CustomNode,
};
const edgeTypes = {};

const defaultViewport = { x: 0, y: 0, zoom: 1 };

export function ReactFlowRenderer({
    nodes = [],
    edges = [],
    groups = [],
    isRelationshipDescActive,
    isNodeDescActive,
    nodeClickedCallback,
    edgeClickedCallback,
    calmKey,
}: ReactFlowRendererProps) {
    const [reactFlowNodes, setNodes, onNodesChange] = useNodesState([]);
    const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState([]);
    const [viewport] = useState(defaultViewport);

    // Convert nodes using utility function
    const convertNodes = useCallback((inputNodes: ReactFlowNode[], savedPositions?: { id: string, position: { x: number, y: number } }[]) => {
        return convertNodesToReactFlow(inputNodes, isNodeDescActive, savedPositions);
    }, [isNodeDescActive]);

    // Convert edges using utility function
    const convertEdges = useCallback((inputEdges: ReactFlowEdge[], nodes: Node[]) => {
        return convertEdgesToReactFlow(inputEdges, nodes, isRelationshipDescActive);
    }, [isRelationshipDescActive]);

    // Update nodes and edges when props change - optimized to reduce recalculations
    useEffect(() => {
        // Load saved positions first
        const savedPositions = loadStoredNodePositions(calmKey);
        
        const convertedNodes = convertNodes(nodes, savedPositions || undefined);

        // Apply saved positions to converted nodes and snap to grid
        if (savedPositions) {
            convertedNodes.forEach((node) => {
                const savedPos = savedPositions.find((pos) => pos.id === node.id);
                if (savedPos) {
                    // Snap saved position to grid
                    node.position = {
                        x: Math.round(savedPos.position.x / 20) * 20,
                        y: Math.round(savedPos.position.y / 20) * 20,
                    };
                }
            });
        }

        setNodes(convertedNodes);
        
        // Convert edges only after nodes are set - debounced for performance
        requestAnimationFrame(() => {
            const convertedEdges = convertEdges(edges, convertedNodes);
            setEdges(convertedEdges);
        });
    }, [nodes, edges, calmKey, convertNodes, convertEdges, setNodes, setEdges]);


    // Handle node clicks directly to prevent jumping
    const onNodeClick = useCallback(
        (event: React.MouseEvent, node: Node) => {
            event.stopPropagation();
            nodeClickedCallback(node.data);
        },
        [nodeClickedCallback]
    );

    // Handle edge clicks
    const onEdgeClick = useCallback(
        (event: React.MouseEvent, edge: Edge) => {
            event.stopPropagation();
            edgeClickedCallback(edge.data);
        },
        [edgeClickedCallback]
    );

    // Handle node position changes and save positions
    const handleNodesChange = useCallback(
        (changes: Parameters<typeof onNodesChange>[0]) => {
            // Apply changes immediately for responsive UI
            onNodesChange(changes);
            
            // Check if any position changes occurred
            const positionChanges = changes.filter((change) => change.type === 'position');
            
            if (positionChanges.length > 0) {
                // Recalculate edges with new anchor points when nodes move
                requestAnimationFrame(() => {
                    const updatedNodes = reactFlowNodes.map((node) => {
                        const positionChange = positionChanges.find((change) => change.id === node.id);
                        if (positionChange && 'position' in positionChange && positionChange.position) {
                            return { ...node, position: positionChange.position };
                        }
                        return node;
                    });
                    
                    // Recalculate edges with updated node positions
                    const updatedEdges = convertEdges(edges, updatedNodes);
                    setEdges(updatedEdges);
                });
            }
            
            // Only save positions after drag ends - but don't block the UI
            const dragEndChanges = changes.filter((change) => change.type === 'position' && 'dragging' in change && change.dragging === false);
            
            if (dragEndChanges.length > 0) {
                // Save positions asynchronously without blocking the UI
                requestAnimationFrame(() => {
                    const nodePositions = reactFlowNodes.map((node) => ({
                        id: node.id,
                        position: node.position,
                    }));
                    saveNodePositions(calmKey, nodePositions);
                });
            }
        },
        [onNodesChange, reactFlowNodes, calmKey, edges, convertEdges, setEdges]
    );

    return (
        <div className="flex-1 bg-white reactflow-wrapper" style={{ height: '100vh', width: '100%' }}>
            <ReactFlow
                nodes={reactFlowNodes}
                edges={reactFlowEdges}
                onNodesChange={handleNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionMode={ConnectionMode.Loose}
                connectionLineType={ConnectionLineType.SmoothStep}
                defaultViewport={viewport}
                fitView
                fitViewOptions={{
                    padding: 50,
                }}
                selectionMode={SelectionMode.Partial}
                multiSelectionKeyCode="Shift"
                panOnDrag={[0, 2]} // Pan with left mouse (when no node) or right mouse
                panOnScroll={false} // Use scroll for zooming, not panning
                zoomOnScroll={true} // Enable scroll wheel/trackpad zooming
                zoomOnPinch={true} // Enable trackpad pinch zooming
                zoomOnDoubleClick={true}
                minZoom={0.1}
                maxZoom={5}
                preventScrolling={false}
                elementsSelectable={true}
                nodesConnectable={false}
                nodesDraggable={true}
                edgesFocusable={true}
                snapToGrid={true}
                snapGrid={[20, 20]}
                deleteKeyCode={null} // Disable delete key to prevent accidental deletions
                attributionPosition="bottom-left"
                proOptions={{ hideAttribution: true }}
            >
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
                <Controls />
                <MiniMap 
                    nodeColor="#f5f5f5"
                    nodeStrokeWidth={2}
                    nodeStrokeColor="#333"
                    pannable
                    zoomable
                    position="bottom-right"
                />
                <GroupOverlay groups={groups} />
            </ReactFlow>
        </div>
    );
}