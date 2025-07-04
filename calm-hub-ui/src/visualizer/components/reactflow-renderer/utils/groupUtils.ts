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
    return groups.map((group) => {
        // Find nodes that are members of this group
        const memberNodes = nodes.filter((node) => group.memberNodeIds.includes(node.id));

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

        // Add padding around the group with extra space at the top for the label
        const sidePadding = 30;
        const topPadding = 80; // Extra space for the label at the top
        const bottomPadding = 30;

        return {
            id: group.id,
            label: group.label,
            description: group.description,
            type: group.type,
            x: bounds.x - sidePadding,
            y: bounds.y - topPadding,
            width: bounds.width + sidePadding * 2,
            height: bounds.height + topPadding + bottomPadding,
        };
    });
}

export function getGroupStyle(type: 'composed-of' | 'deployed-in') {
    switch (type) {
        case 'composed-of':
            return {
                borderColor: '#000000',
                backgroundColor: 'transparent',
                labelColor: '#000000',
                labelIcon: '',
            };
        case 'deployed-in':
            return {
                borderColor: '#000000',
                backgroundColor: 'transparent',
                labelColor: '#000000',
                labelIcon: '',
            };
        default:
            return {
                borderColor: '#000000',
                backgroundColor: 'transparent',
                labelColor: '#000000',
                labelIcon: '',
            };
    }
}
