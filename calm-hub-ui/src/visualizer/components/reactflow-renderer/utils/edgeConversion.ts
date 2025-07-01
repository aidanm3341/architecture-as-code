import { Edge, Node, MarkerType } from 'reactflow';
import { ReactFlowEdge } from '../../../contracts/contracts.js';

interface AnchorPoints {
    sourceHandle: string;
    targetHandle: string;
}

export function calculateAnchorPoints(sourceId: string, targetId: string, nodes: Node[]): AnchorPoints {
    const sourceNode = nodes.find(n => n.id === sourceId);
    const targetNode = nodes.find(n => n.id === targetId);
    
    if (!sourceNode || !targetNode) {
        return { sourceHandle: 'bottom', targetHandle: 'top' };
    }
    
    const sourceCenter = {
        x: sourceNode.position.x + (sourceNode.style?.width as number || 200) / 2,
        y: sourceNode.position.y + (sourceNode.style?.height as number || 80) / 2,
    };
    
    const targetCenter = {
        x: targetNode.position.x + (targetNode.style?.width as number || 200) / 2,
        y: targetNode.position.y + (targetNode.style?.height as number || 80) / 2,
    };
    
    const deltaX = targetCenter.x - sourceCenter.x;
    const deltaY = targetCenter.y - sourceCenter.y;
    
    // Determine source handle based on direction to target
    let sourceHandle = 'bottom';
    let targetHandle = 'top';
    
    // Use the larger delta to determine primary direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal connection is primary
        if (deltaX > 0) {
            sourceHandle = 'right';
            targetHandle = 'left';
        } else {
            sourceHandle = 'left';
            targetHandle = 'right';
        }
    } else {
        // Vertical connection is primary
        if (deltaY > 0) {
            sourceHandle = 'bottom';
            targetHandle = 'top';
        } else {
            sourceHandle = 'top';
            targetHandle = 'bottom';
        }
    }
    
    return { sourceHandle, targetHandle };
}

// Enhanced edge types for different relationship kinds
const getEdgeStyle = (relationshipType?: string) => {
    const type = relationshipType?.toLowerCase() || 'default';
    
    const edgeStyles = {
        'connects-to': {
            stroke: '#4a90e2',
            strokeWidth: 3,
            strokeDasharray: '0',
            markerColor: '#4a90e2'
        },
        'depends-on': {
            stroke: '#e74c3c',
            strokeWidth: 2,
            strokeDasharray: '8,4',
            markerColor: '#e74c3c'
        },
        'deployed-in': {
            stroke: '#27ae60',
            strokeWidth: 2,
            strokeDasharray: '12,3',
            markerColor: '#27ae60'
        },
        'composed-of': {
            stroke: '#9b59b6',
            strokeWidth: 3,
            strokeDasharray: '0',
            markerColor: '#9b59b6'
        },
        'contains': {
            stroke: '#f39c12',
            strokeWidth: 2,
            strokeDasharray: '6,2',
            markerColor: '#f39c12'
        },
        'interacts-with': {
            stroke: '#1abc9c',
            strokeWidth: 2,
            strokeDasharray: '4,4',
            markerColor: '#1abc9c'
        },
        default: {
            stroke: '#34495e',
            strokeWidth: 2,
            strokeDasharray: '0',
            markerColor: '#34495e'
        }
    };
    
    return edgeStyles[type as keyof typeof edgeStyles] || edgeStyles.default;
};

export function convertEdgesToReactFlow(
    inputEdges: ReactFlowEdge[], 
    nodes: Node[], 
    isRelationshipDescActive: boolean
): Edge[] {
    return inputEdges.map((edge, index) => {
        const { sourceHandle, targetHandle } = calculateAnchorPoints(edge.data.source, edge.data.target, nodes);
        const edgeStyle = getEdgeStyle(edge.data.relationshipType);
        
        // Enhanced label with better formatting
        const label = isRelationshipDescActive ? edge.data.label : '';
        
        return {
            id: edge.data.id,
            source: edge.data.source,
            target: edge.data.target,
            sourceHandle,
            targetHandle,
            type: 'smoothstep', // Changed from 'straight' for better curves
            label,
            data: {
                ...edge.data,
                edgeIndex: index // Add index for stagger effect
            },
            style: {
                stroke: edgeStyle.stroke,
                strokeWidth: edgeStyle.strokeWidth,
                strokeDasharray: edgeStyle.strokeDasharray,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            },
            labelStyle: {
                fontSize: '13px',
                fontWeight: '600',
                color: '#2c3e50',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '6px 12px',
                borderRadius: '12px',
                border: `2px solid ${edgeStyle.stroke}`,
                boxShadow: `0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.8)`,
                backdropFilter: 'blur(8px)',
                textShadow: 'none',
                lineHeight: '1.2',
                maxWidth: '200px',
                wordBreak: 'break-word',
                textAlign: 'center',
                userSelect: 'none',
                pointerEvents: 'none'
            },
            labelBgPadding: [8, 4] as [number, number],
            labelBgBorderRadius: 12,
            labelBgStyle: {
                fill: 'rgba(255, 255, 255, 0.95)',
                stroke: edgeStyle.stroke,
                strokeWidth: 1,
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))'
            },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 25,
                height: 25,
                color: edgeStyle.markerColor,
            },
            animated: false, // Can be enabled for specific edge types if needed
        };
    });
}