import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
    label: string;
    name: string;
    id: string;
    nodeType?: string;
    description?: string;
}

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
    // Enhanced color and shape system based on node types
    const getNodeStyle = () => {
        const nodeType = data.nodeType?.toLowerCase() || 'default';
        
        // Define base styles for different node types
        const nodeStyles = {
            service: {
                backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderColor: '#667eea',
                shape: '12px',
                icon: '🔧',
                shadowColor: 'rgba(102, 126, 234, 0.4)'
            },
            database: {
                backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderColor: '#f093fb',
                shape: '8px',
                icon: '🗄️',
                shadowColor: 'rgba(240, 147, 251, 0.4)'
            },
            api: {
                backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderColor: '#4facfe',
                shape: '16px',
                icon: '🔌',
                shadowColor: 'rgba(79, 172, 254, 0.4)'
            },
            frontend: {
                backgroundColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                borderColor: '#43e97b',
                shape: '14px',
                icon: '💻',
                shadowColor: 'rgba(67, 233, 123, 0.4)'
            },
            backend: {
                backgroundColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                borderColor: '#fa709a',
                shape: '10px',
                icon: '⚙️',
                shadowColor: 'rgba(250, 112, 154, 0.4)'
            },
            external: {
                backgroundColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                borderColor: '#a8edea',
                shape: '6px',
                icon: '🌐',
                shadowColor: 'rgba(168, 237, 234, 0.4)'
            },
            queue: {
                backgroundColor: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                borderColor: '#ffecd2',
                shape: '20px',
                icon: '📬',
                shadowColor: 'rgba(255, 236, 210, 0.4)'
            },
            cache: {
                backgroundColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                borderColor: '#ff9a9e',
                shape: '18px',
                icon: '⚡',
                shadowColor: 'rgba(255, 154, 158, 0.4)'
            },
            default: {
                backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderColor: '#667eea',
                shape: '8px',
                icon: '📦',
                shadowColor: 'rgba(102, 126, 234, 0.3)'
            }
        };
        
        return nodeStyles[nodeType as keyof typeof nodeStyles] || nodeStyles.default;
    };
    
    const nodeStyle = getNodeStyle();
    
    return (
        <div
            className={`custom-node ${data.nodeType?.toLowerCase() || 'default'} ${selected ? 'selected' : ''}`}
            style={{
                background: nodeStyle.backgroundColor,
                border: `${selected ? '3' : '2'}px solid ${nodeStyle.borderColor}`,
                borderRadius: nodeStyle.shape,
                padding: '16px',
                fontSize: '14px',
                fontWeight: '600',
                width: '220px',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'relative',
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                boxShadow: selected 
                    ? `0 8px 25px ${nodeStyle.shadowColor}, 0 0 0 3px ${nodeStyle.borderColor}33`
                    : `0 4px 15px ${nodeStyle.shadowColor}`,
                transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                transform: selected ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
            }}
        >
            {/* Node Type Icon */}
            <div style={{
                fontSize: '24px',
                marginBottom: '8px',
                opacity: 0.9
            }}>
                {nodeStyle.icon}
            </div>
            
            {/* Main Label */}
            <div style={{
                fontSize: '14px',
                fontWeight: '700',
                lineHeight: '1.3',
                marginBottom: data.description ? '6px' : '0',
                wordBreak: 'break-word',
                maxWidth: '100%'
            }}>
                {data.label}
            </div>
            
            {/* Description */}
            {data.description && (
                <div style={{
                    fontSize: '11px',
                    opacity: 0.85,
                    fontWeight: '400',
                    lineHeight: '1.2',
                    textAlign: 'center',
                    maxWidth: '100%',
                    wordBreak: 'break-word'
                }}>
                    {data.description}
                </div>
            )}
            
            {/* Node Type Badge */}
            {data.nodeType && (
                <div style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontSize: '9px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    backdropFilter: 'blur(4px)'
                }}>
                    {data.nodeType}
                </div>
            )}
            
            {/* Enhanced Handles */}
            <Handle 
                type="target" 
                position={Position.Top} 
                id="top" 
                style={{
                    backgroundColor: nodeStyle.borderColor,
                    border: '2px solid white',
                    width: '12px',
                    height: '12px',
                    boxShadow: `0 2px 8px ${nodeStyle.shadowColor}`
                }}
            />
            <Handle 
                type="source" 
                position={Position.Top} 
                id="top-source" 
                style={{
                    backgroundColor: nodeStyle.borderColor,
                    border: '2px solid white',
                    width: '12px',
                    height: '12px',
                    boxShadow: `0 2px 8px ${nodeStyle.shadowColor}`
                }}
            />
            <Handle 
                type="target" 
                position={Position.Right} 
                id="right" 
                style={{
                    backgroundColor: nodeStyle.borderColor,
                    border: '2px solid white',
                    width: '12px',
                    height: '12px',
                    boxShadow: `0 2px 8px ${nodeStyle.shadowColor}`
                }}
            />
            <Handle 
                type="source" 
                position={Position.Right} 
                id="right-source" 
                style={{
                    backgroundColor: nodeStyle.borderColor,
                    border: '2px solid white',
                    width: '12px',
                    height: '12px',
                    boxShadow: `0 2px 8px ${nodeStyle.shadowColor}`
                }}
            />
            <Handle 
                type="target" 
                position={Position.Bottom} 
                id="bottom" 
                style={{
                    backgroundColor: nodeStyle.borderColor,
                    border: '2px solid white',
                    width: '12px',
                    height: '12px',
                    boxShadow: `0 2px 8px ${nodeStyle.shadowColor}`
                }}
            />
            <Handle 
                type="source" 
                position={Position.Bottom} 
                id="bottom-source" 
                style={{
                    backgroundColor: nodeStyle.borderColor,
                    border: '2px solid white',
                    width: '12px',
                    height: '12px',
                    boxShadow: `0 2px 8px ${nodeStyle.shadowColor}`
                }}
            />
            <Handle 
                type="target" 
                position={Position.Left} 
                id="left" 
                style={{
                    backgroundColor: nodeStyle.borderColor,
                    border: '2px solid white',
                    width: '12px',
                    height: '12px',
                    boxShadow: `0 2px 8px ${nodeStyle.shadowColor}`
                }}
            />
            <Handle 
                type="source" 
                position={Position.Left} 
                id="left-source" 
                style={{
                    backgroundColor: nodeStyle.borderColor,
                    border: '2px solid white',
                    width: '12px',
                    height: '12px',
                    boxShadow: `0 2px 8px ${nodeStyle.shadowColor}`
                }}
            />
        </div>
    );
}

export default memo(CustomNode);