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
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ReactFlowNode, ReactFlowEdge } from '../../contracts/contracts.js';
import {
    saveNodePositions,
    loadStoredNodePositions,
} from '../../services/node-position-service.js';
import CustomNode from './components/CustomNode.js';
import CustomEdge from './components/CustomEdge.js';
import { GroupOverlay } from './components/GroupOverlay.js';
import { convertNodesToReactFlow } from './utils/nodeConversion.js';
import { convertEdgesToReactFlow } from './utils/edgeConversion.js';
import { applyDagreLayout, getLayoutOptions, getLayoutName } from './utils/layoutUtils.js';

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
const edgeTypes = {
    custom: CustomEdge,
};

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
    const [showLayoutControls, setShowLayoutControls] = useState(false);

    // Convert nodes using utility function
    const convertNodes = useCallback((inputNodes: ReactFlowNode[], savedPositions?: { id: string, position: { x: number, y: number } }[]) => {
        return convertNodesToReactFlow(inputNodes, isNodeDescActive, savedPositions);
    }, [isNodeDescActive]);

    // Convert edges using utility function
    const convertEdges = useCallback((inputEdges: ReactFlowEdge[], nodes: Node[]) => {
        return convertEdgesToReactFlow(inputEdges, nodes, isRelationshipDescActive);
    }, [isRelationshipDescActive]);

    // Apply automatic layout
    const applyLayout = useCallback((direction: 'TB' | 'BT' | 'LR' | 'RL' = 'TB') => {
        if (reactFlowNodes.length === 0) return;
        
        const layoutedNodes = applyDagreLayout(reactFlowNodes, reactFlowEdges, {
            direction,
            spacing: {
                rank: direction === 'LR' || direction === 'RL' ? 180 : 120,
                node: direction === 'LR' || direction === 'RL' ? 100 : 80,
            },
        });
        
        setNodes(layoutedNodes);
        
        // Recalculate edges with new anchor points after layout
        requestAnimationFrame(() => {
            const updatedEdges = convertEdges(edges, layoutedNodes);
            setEdges(updatedEdges);
        });
        
        // Save the new positions
        const nodePositions = layoutedNodes.map((node) => ({
            id: node.id,
            position: node.position,
        }));
        saveNodePositions(calmKey, nodePositions);
    }, [reactFlowNodes, reactFlowEdges, setNodes, calmKey, edges, convertEdges, setEdges]);

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
                    // Determine node dimensions
                    const nodeType = (node.data.nodeType || node.data.type)?.toLowerCase() || 'default';
                    const isDatabase = nodeType === 'database';
                    const isActor = nodeType === 'actor';
                    
                    let nodeWidth = 220;
                    let nodeHeight = 120;
                    
                    if (isDatabase) {
                        nodeWidth = 180;
                        nodeHeight = 120;
                    } else if (isActor) {
                        nodeWidth = 200;
                        nodeHeight = 180;
                    }
                    
                    // Snap saved position to grid using center-based alignment
                    const centerX = savedPos.position.x + nodeWidth / 2;
                    const centerY = savedPos.position.y + nodeHeight / 2;
                    
                    const snappedCenterX = Math.round(centerX / 20) * 20;
                    const snappedCenterY = Math.round(centerY / 20) * 20;
                    
                    node.position = {
                        x: snappedCenterX - nodeWidth / 2,
                        y: snappedCenterY - nodeHeight / 2,
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
        <div className="flex-1 bg-white reactflow-wrapper" style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
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
                connectionLineType={ConnectionLineType.Step}
                defaultEdgeOptions={{
                    type: 'step',
                    style: { strokeWidth: 2 },
                    markerEnd: { type: MarkerType.ArrowClosed },
                }}
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
                
                {/* Layout Controls */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                }}>
                    <button
                        onClick={() => setShowLayoutControls(!showLayoutControls)}
                        style={{
                            padding: '8px 12px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#374151',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        🎯 Layout
                    </button>
                    
                    {showLayoutControls && (
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            backdropFilter: 'blur(12px)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            minWidth: '120px',
                        }}>
                            <div style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                color: '#6b7280',
                                marginBottom: '4px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}>
                                Auto Layout
                            </div>
                            
                            {getLayoutOptions().map((option) => (
                                <button
                                    key={option.direction}
                                    onClick={() => {
                                        applyLayout(option.direction);
                                        setShowLayoutControls(false);
                                    }}
                                    style={{
                                        padding: '6px 10px',
                                        background: 'transparent',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '11px',
                                        fontWeight: '500',
                                        color: '#374151',
                                        textAlign: 'left',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#f3f4f6';
                                        e.currentTarget.style.borderColor = '#d1d5db';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                    }}
                                >
                                    {getLayoutName(option.direction)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                <GroupOverlay groups={groups} />
            </ReactFlow>
        </div>
    );
}