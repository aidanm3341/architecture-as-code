import { useReactFlow, useViewport, useNodes } from 'reactflow';
import { useMemo } from 'react';
import { calculateGroupBounds, getGroupStyle } from '../utils/groupUtils.js';

interface GroupData {
    id: string;
    label: string;
    description?: string;
    type: 'composed-of' | 'deployed-in';
    memberNodeIds: string[];
}

interface GroupOverlayProps {
    groups: GroupData[];
}

export function GroupOverlay({ groups }: GroupOverlayProps) {
    const nodes = useNodes(); // This hook automatically updates when nodes change (including positions)
    const viewport = useViewport(); // This hook automatically updates on viewport changes
    
    // Recalculate group bounds whenever viewport, groups, or node positions change
    const groupBounds = useMemo(() => {
        if (!groups || groups.length === 0) {
            return [];
        }
        return calculateGroupBounds(groups, nodes);
    }, [groups, viewport.x, viewport.y, viewport.zoom, nodes]);
    
    if (!groups || groups.length === 0) {
        return null;
    }

    return (
        <div 
            className="absolute inset-0 pointer-events-none"
            style={{
                transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
                transformOrigin: '0 0',
                zIndex: 5, // Above background but below nodes
            }}
        >
            {groupBounds.map(group => {
                const style = getGroupStyle(group.type);
                
                return (
                    <div
                        key={group.id}
                        className="absolute"
                        style={{
                            left: group.x,
                            top: group.y,
                            width: group.width,
                            height: group.height,
                            border: `2px dashed ${style.borderColor}`,
                            backgroundColor: style.backgroundColor,
                            borderRadius: '12px',
                            pointerEvents: 'none',
                        }}
                    >
                        {/* Group label */}
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
                                color: style.labelColor,
                                border: `1px solid ${style.labelColor}`,
                                borderRadius: '6px',
                                backdropFilter: 'blur(2px)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                maxWidth: 'fit-content',
                            }}
                        >
                            <span style={{ fontSize: '16px' }}>{style.labelIcon}</span>
                            <span style={{ flex: 1, fontWeight: '600' }}>{group.label}</span>
                            {group.description && (
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
                                    {group.description}
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}