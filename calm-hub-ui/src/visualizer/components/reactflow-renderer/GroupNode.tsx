import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface GroupNodeData {
    label: string;
    name: string;
    id: string;
    nodeType?: string;
    description?: string;
    relationshipType?: 'composed-of' | 'deployed-in' | 'contains' | 'group';
}

function GroupNode({ data, selected }: NodeProps<GroupNodeData>) {
    // Determine visual style based on relationship type
    const getGroupStyle = () => {
        const relationshipType = data.relationshipType || 'group';
        
        switch (relationshipType) {
            case 'composed-of':
                return {
                    backgroundColor: 'rgba(74, 144, 226, 0.08)',
                    border: '2px dashed #4a90e2',
                    borderRadius: '12px',
                    labelColor: '#4a90e2',
                    labelIcon: '📦', // Component/composition icon
                };
            case 'deployed-in':
                return {
                    backgroundColor: 'rgba(34, 139, 34, 0.08)',
                    border: '2px dashed #228b22',
                    borderRadius: '8px',
                    labelColor: '#228b22',
                    labelIcon: '🌐', // Network/deployment icon
                };
            case 'contains':
                return {
                    backgroundColor: 'rgba(255, 140, 0, 0.08)',
                    border: '2px dashed #ff8c00',
                    borderRadius: '10px',
                    labelColor: '#ff8c00',
                    labelIcon: '📋', // Container icon
                };
            default:
                return {
                    backgroundColor: 'rgba(128, 128, 128, 0.08)',
                    border: '2px dashed #666',
                    borderRadius: '8px',
                    labelColor: '#666',
                    labelIcon: '📁', // Generic group icon
                };
        }
    };

    const groupStyle = getGroupStyle();
    
    return (
        <div
            className={`group-node ${selected ? 'selected' : ''} ${data.relationshipType || 'default'}`}
            style={{
                ...groupStyle,
                backgroundColor: groupStyle.backgroundColor,
                border: selected ? `3px dashed ${groupStyle.labelColor}` : groupStyle.border,
                borderRadius: groupStyle.borderRadius,
                padding: '40px 30px 30px 30px', // More top padding for internal label
                minWidth: '400px',
                minHeight: '300px',
                position: 'relative',
                width: '100%',
                height: '100%',
                boxShadow: selected ? `0 0 12px ${groupStyle.labelColor}33` : '0 0 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease-in-out',
            }}
        >
            {/* Internal header area with icon and label */}
            <div
                style={{
                    position: 'absolute',
                    top: '8px',
                    left: '12px',
                    right: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '6px 12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: groupStyle.labelColor,
                    border: `1px solid ${groupStyle.labelColor}`,
                    borderRadius: '6px',
                    backdropFilter: 'blur(2px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
            >
                <span style={{ fontSize: '16px' }}>{groupStyle.labelIcon}</span>
                <span style={{ flex: 1, fontWeight: '600' }}>{data.label}</span>
                {data.description && (
                    <span style={{ 
                        fontSize: '12px', 
                        color: '#666', 
                        fontWeight: 'normal',
                        opacity: 0.8,
                        maxWidth: '200px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {data.description}
                    </span>
                )}
            </div>
            
            {/* Improved content area with better visual separation */}
            <div
                style={{
                    position: 'absolute',
                    top: '45px',
                    left: '12px',
                    right: '12px',
                    bottom: '12px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    minHeight: '200px',
                }}
            >
                {/* This area contains the child nodes */}
            </div>
            
            {/* Enhanced handles for better connection capabilities */}
            <Handle
                type="target"
                position={Position.Top}
                id="top"
                style={{ 
                    visibility: 'hidden',
                    width: '12px',
                    height: '12px',
                    backgroundColor: groupStyle.labelColor,
                    border: `2px solid white`,
                }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                style={{ 
                    visibility: 'hidden',
                    width: '12px',
                    height: '12px',
                    backgroundColor: groupStyle.labelColor,
                    border: `2px solid white`,
                }}
            />
            <Handle
                type="target"
                position={Position.Left}
                id="left"
                style={{ 
                    visibility: 'hidden',
                    width: '12px',
                    height: '12px',
                    backgroundColor: groupStyle.labelColor,
                    border: `2px solid white`,
                }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="right"
                style={{ 
                    visibility: 'hidden',
                    width: '12px',
                    height: '12px',
                    backgroundColor: groupStyle.labelColor,
                    border: `2px solid white`,
                }}
            />
        </div>
    );
}

export default memo(GroupNode);