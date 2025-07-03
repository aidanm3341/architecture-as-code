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
        return { sourceHandle: 'bottom-source', targetHandle: 'top' };
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
    let sourceHandle = 'bottom-source';
    let targetHandle = 'top';
    
    // Use the larger delta to determine primary direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal connection is primary
        if (deltaX > 0) {
            sourceHandle = 'right-source';
            targetHandle = 'left';
        } else {
            sourceHandle = 'left-source';
            targetHandle = 'right';
        }
    } else {
        // Vertical connection is primary
        if (deltaY > 0) {
            sourceHandle = 'bottom-source';
            targetHandle = 'top';
        } else {
            sourceHandle = 'top-source';
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
                fontSize: '10px',
                fontWeight: '300',
                color: '#6b7280',
                backgroundColor: 'rgba(255, 255, 255, 0.99)',
                padding: '4px 8px',
                borderRadius: '4px',
                border: `1px solid ${edgeStyle.stroke}`,
                boxShadow: `0 1px 3px rgba(0,0,0,0.06)`,
                backdropFilter: 'blur(1px)',
                textShadow: 'none',
                lineHeight: '1.6',
                maxWidth: '140px',
                wordBreak: 'break-word',
                textAlign: 'center',
                userSelect: 'none',
                pointerEvents: 'none',
                whiteSpace: 'pre-wrap',
                letterSpacing: '0.05em',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
            },
            labelBgPadding: [6, 3] as [number, number],
            labelBgBorderRadius: 8,
            labelBgStyle: {
                fill: 'rgba(255, 255, 255, 0.98)',
                stroke: edgeStyle.stroke,
                strokeWidth: 0.5,
                filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))'
            },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: edgeStyle.markerColor,
            },
            animated: false, // Can be enabled for specific edge types if needed
        };
    });
}