import { Node } from 'reactflow';
import { ReactFlowNode } from '../../../contracts/contracts.js';

export interface GroupSizeCalculation {
    width: number;
    height: number;
}

export interface NodePositions {
    id: string;
    position: { x: number; y: number };
}

function snapToGrid(position: { x: number; y: number }, gridSize = 20): { x: number; y: number } {
    return {
        x: Math.round(position.x / gridSize) * gridSize,
        y: Math.round(position.y / gridSize) * gridSize,
    };
}

export function calculateGroupSize(
    children: ReactFlowNode[], 
    savedPositions?: NodePositions[]
): GroupSizeCalculation {
    if (children.length === 0) return { width: 450, height: 350 };
    
    const childCount = children.length;
    
    // Calculate optimal grid layout for children
    const cols = Math.max(2, Math.ceil(Math.sqrt(childCount)));
    const rows = Math.ceil(childCount / cols);
    
    // Improved default sizing with better spacing calculations
    const nodeWidth = 220; // Wider nodes for better readability
    const nodeHeight = 100; // Taller nodes
    const horizontalSpacing = 40; // Space between columns
    const verticalSpacing = 30; // Space between rows
    const headerHeight = 60; // Space for group header
    const padding = 40; // Border padding
    
    const defaultWidth = Math.max(450, (cols * nodeWidth) + ((cols - 1) * horizontalSpacing) + (padding * 2));
    const defaultHeight = Math.max(350, headerHeight + (rows * nodeHeight) + ((rows - 1) * verticalSpacing) + (padding * 2));
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let hasValidPositions = false;
    
    children.forEach((child) => {
        // Get saved position or calculate default
        let childPos = savedPositions?.find(pos => pos.id === child.data.id)?.position;
        if (!childPos) {
            childPos = child.position;
        }
        
        // Only calculate bounds if we have actual positions
        if (childPos && childPos.x !== undefined && childPos.y !== undefined) {
            hasValidPositions = true;
            
            minX = Math.min(minX, childPos.x);
            minY = Math.min(minY, childPos.y);
            maxX = Math.max(maxX, childPos.x + nodeWidth);
            maxY = Math.max(maxY, childPos.y + nodeHeight);
        }
    });
    
    // If we don't have valid positions, use calculated default size
    if (!hasValidPositions) {
        return { width: defaultWidth, height: defaultHeight };
    }
    
    // Add generous padding around children, accounting for header
    const totalPadding = padding * 2;
    return {
        width: Math.max(defaultWidth, maxX - minX + totalPadding),
        height: Math.max(defaultHeight, maxY - minY + headerHeight + totalPadding),
    };
}

export function convertNodesToReactFlow(
    inputNodes: ReactFlowNode[], 
    isNodeDescActive: boolean,
    savedPositions?: NodePositions[]
): Node[] {
    const result: Node[] = [];
    const parentNodes = new Set<string>();
    const childNodes = new Map<string, ReactFlowNode[]>();
    const parentRelationshipTypes = new Map<string, string>();

    // Identify parent nodes and group children
    inputNodes.forEach((node) => {
        if (node.data.parent) {
            parentNodes.add(node.data.parent);
            if (!childNodes.has(node.data.parent)) {
                childNodes.set(node.data.parent, []);
            }
            childNodes.get(node.data.parent)!.push(node);
            
            // Store relationship type if available
            if (node.data.parentRelationshipType) {
                parentRelationshipTypes.set(node.data.parent, node.data.parentRelationshipType);
            }
        }
    });

    // Create parent nodes first
    parentNodes.forEach((parentId) => {
        const parentNode = inputNodes.find((n) => n.data.id === parentId);
        if (parentNode) {
            const parentLabel = isNodeDescActive
                ? parentNode.data.reactFlowProps.labelWithDescription
                : parentNode.data.reactFlowProps.labelWithoutDescription;

            const children = childNodes.get(parentId) || [];
            const groupSize = calculateGroupSize(children, savedPositions);
            const relationshipType = parentRelationshipTypes.get(parentId) || 'group';

            // Snap parent position to grid
            const parentPosition = parentNode.position || { x: Math.random() * 300, y: Math.random() * 300 };
            const snappedParentPosition = snapToGrid(parentPosition);

            result.push({
                id: parentId,
                type: 'group',
                position: snappedParentPosition,
                data: {
                    ...parentNode.data,
                    label: parentLabel,
                    relationshipType: relationshipType,
                    description: parentNode.data.description,
                    nodeType: parentNode.data.nodeType,
                },
                style: {
                    width: groupSize.width,
                    height: groupSize.height,
                },
                draggable: true,
                selectable: true,
            });
        }
    });

    // Create regular nodes (non-parents and children)
    inputNodes.forEach((node) => {
        // Skip if this is a parent node (already created above)
        if (parentNodes.has(node.data.id)) {
            return;
        }

        const label = isNodeDescActive
            ? node.data.reactFlowProps.labelWithDescription
            : node.data.reactFlowProps.labelWithoutDescription;

        // Snap position to grid
        const basePosition = node.position || { x: Math.random() * 500, y: Math.random() * 500 };
        const snappedPosition = snapToGrid(basePosition);

        const baseNode: Node = {
            id: node.data.id,
            type: 'custom',
            position: snappedPosition,
            data: {
                ...node.data,
                label,
            },
            draggable: true,
            selectable: true,
        };

        // If this node has a parent, set parent relationship
        if (node.data.parent && parentNodes.has(node.data.parent)) {
            baseNode.parentId = node.data.parent;
            baseNode.extent = 'parent';
            // Position relative to parent with improved grid layout
            if (!node.position) {
                const childIndex = childNodes.get(node.data.parent)!.findIndex(n => n.data.id === node.data.id);
                const totalChildren = childNodes.get(node.data.parent)!.length;
                const cols = Math.max(2, Math.ceil(Math.sqrt(totalChildren)));
                const nodeWidth = 220;
                const nodeHeight = 100;
                const horizontalSpacing = 40;
                const verticalSpacing = 30;
                const headerHeight = 60; // Account for group header
                const leftPadding = 40;
                
                const col = childIndex % cols;
                const row = Math.floor(childIndex / cols);
                
                const childPosition = {
                    x: leftPadding + col * (nodeWidth + horizontalSpacing),
                    y: headerHeight + row * (nodeHeight + verticalSpacing),
                };
                baseNode.position = snapToGrid(childPosition);
            }
        }

        result.push(baseNode);
    });

    return result;
}