import { Node, getNodesBounds } from 'reactflow';

interface GroupData {
    id: string;
    label: string;
    description?: string;
    type: 'composed-of' | 'deployed-in';
    memberNodeIds: string[];
}

interface GroupBounds {
    id: string;
    label: string;
    description?: string;
    type: 'composed-of' | 'deployed-in';
    x: number;
    y: number;
    width: number;
    height: number;
}

export function calculateGroupBounds(groups: GroupData[], nodes: Node[]): GroupBounds[] {
    return groups.map(group => {
        // Find nodes that are members of this group
        const memberNodes = nodes.filter(node => 
            group.memberNodeIds.includes(node.id)
        );

        if (memberNodes.length === 0) {
            // If no member nodes are found, return a default small rectangle
            return {
                id: group.id,
                label: group.label,
                description: group.description,
                type: group.type,
                x: 0,
                y: 0,
                width: 100,
                height: 100,
            };
        }

        // Use ReactFlow's getNodesBounds utility
        const bounds = getNodesBounds(memberNodes);
        
        // Add padding around the group
        const padding = 30;
        
        return {
            id: group.id,
            label: group.label,
            description: group.description,
            type: group.type,
            x: bounds.x - padding,
            y: bounds.y - padding,
            width: bounds.width + (padding * 2),
            height: bounds.height + (padding * 2),
        };
    });
}

export function getGroupStyle(type: 'composed-of' | 'deployed-in') {
    switch (type) {
        case 'composed-of':
            return {
                borderColor: '#4a90e2',
                backgroundColor: 'rgba(74, 144, 226, 0.08)',
                labelColor: '#4a90e2',
                labelIcon: '📦',
            };
        case 'deployed-in':
            return {
                borderColor: '#228b22',
                backgroundColor: 'rgba(34, 139, 34, 0.08)',
                labelColor: '#228b22',
                labelIcon: '🌐',
            };
        default:
            return {
                borderColor: '#666',
                backgroundColor: 'rgba(128, 128, 128, 0.08)',
                labelColor: '#666',
                labelIcon: '📁',
            };
    }
}