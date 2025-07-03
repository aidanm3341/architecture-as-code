import dagre from 'dagre';
import { Node, Edge } from 'reactflow';

interface LayoutOptions {
    direction: 'TB' | 'BT' | 'LR' | 'RL';
    nodeWidth: number;
    nodeHeight: number;
    spacing: {
        rank: number; // spacing between ranks (levels)
        node: number; // spacing between nodes on the same rank
    };
}

const defaultLayoutOptions: LayoutOptions = {
    direction: 'TB', // Top to Bottom
    nodeWidth: 220,
    nodeHeight: 120,
    spacing: {
        rank: 120, // Increased spacing between levels
        node: 80,  // Increased spacing between nodes on same level
    },
};

export function applyDagreLayout(
    nodes: Node[],
    edges: Edge[],
    options: Partial<LayoutOptions> = {}
): Node[] {
    const layoutOptions = { ...defaultLayoutOptions, ...options };
    
    // Create a new directed graph
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    
    // Configure the graph with improved settings for edge clarity
    dagreGraph.setGraph({
        rankdir: layoutOptions.direction,
        ranksep: layoutOptions.spacing.rank,
        nodesep: layoutOptions.spacing.node,
        edgesep: Math.max(30, layoutOptions.spacing.node / 2), // Minimum edge separation
        marginx: 80,
        marginy: 80,
        // Dagre-specific settings for better edge routing
        acyclicer: 'greedy', // Better cycle removal
        ranker: 'network-simplex', // Better ranking algorithm
        align: 'UL', // Align nodes to upper-left for consistency
    });
    
    // Add nodes to the graph
    nodes.forEach((node) => {
        // Handle different node sizes for database, actor, and regular nodes
        const nodeType = (node.data.nodeType || node.data.type)?.toLowerCase() || 'default';
        const isDatabase = nodeType === 'database';
        const isActor = nodeType === 'actor';
        
        let nodeWidth = layoutOptions.nodeWidth;
        let nodeHeight = layoutOptions.nodeHeight;
        
        if (isDatabase) {
            nodeWidth = 180;
            nodeHeight = 120;
        } else if (isActor) {
            nodeWidth = 200;
            nodeHeight = 180;
        }
        
        dagreGraph.setNode(node.id, {
            width: nodeWidth,
            height: nodeHeight,
        });
    });
    
    // Add edges to the graph
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });
    
    // Run the layout algorithm
    dagre.layout(dagreGraph);
    
    // Apply the calculated positions to nodes
    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        
        if (nodeWithPosition) {
            // Calculate the position so that the node CENTER aligns to grid
            const centerX = nodeWithPosition.x;
            const centerY = nodeWithPosition.y;
            
            // Snap center to grid, then calculate top-left position
            const snappedCenterX = Math.round(centerX / 20) * 20;
            const snappedCenterY = Math.round(centerY / 20) * 20;
            
            // Calculate top-left position from snapped center
            const x = snappedCenterX - nodeWithPosition.width / 2;
            const y = snappedCenterY - nodeWithPosition.height / 2;
            
            return {
                ...node,
                position: { x, y },
            };
        }
        
        return node;
    });
    
    return layoutedNodes;
}

export function getLayoutOptions(): LayoutOptions[] {
    return [
        {
            direction: 'TB',
            nodeWidth: 220,
            nodeHeight: 120,
            spacing: { rank: 120, node: 80 },
        },
        {
            direction: 'LR',
            nodeWidth: 220,
            nodeHeight: 120,
            spacing: { rank: 180, node: 100 },
        },
        {
            direction: 'BT',
            nodeWidth: 220,
            nodeHeight: 120,
            spacing: { rank: 120, node: 80 },
        },
        {
            direction: 'RL',
            nodeWidth: 220,
            nodeHeight: 120,
            spacing: { rank: 180, node: 100 },
        },
    ];
}

export function getLayoutName(direction: string): string {
    switch (direction) {
        case 'TB':
            return 'Top to Bottom';
        case 'LR':
            return 'Left to Right';
        case 'BT':
            return 'Bottom to Top';
        case 'RL':
            return 'Right to Left';
        default:
            return 'Unknown';
    }
}