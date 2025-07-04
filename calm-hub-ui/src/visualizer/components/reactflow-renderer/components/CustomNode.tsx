import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
    label: string;
    name: string;
    id: string;
    nodeType?: string;
    type?: string;
    description?: string;
}

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
    // Enhanced color and shape system based on node types
    const getNodeStyle = () => {
        const nodeType = (data.nodeType || data.type)?.toLowerCase() || 'default';
        
        // Define base styles for different node types
        const nodeStyles = {
            service: {
                backgroundColor: '#667eea',
                borderColor: '#667eea',
                shape: '12px',
                shadowColor: 'rgba(102, 126, 234, 0.4)'
            },
            database: {
                backgroundColor: '#f093fb',
                borderColor: '#f093fb',
                shape: 'cylinder',
                shadowColor: 'rgba(240, 147, 251, 0.4)'
            },
            actor: {
                backgroundColor: '#ff9a56',
                borderColor: '#ff9a56',
                shape: 'actor',
                shadowColor: 'rgba(255, 154, 86, 0.4)'
            },
            api: {
                backgroundColor: '#4facfe',
                borderColor: '#4facfe',
                shape: '16px',
                shadowColor: 'rgba(79, 172, 254, 0.4)'
            },
            frontend: {
                backgroundColor: '#43e97b',
                borderColor: '#43e97b',
                shape: '14px',
                shadowColor: 'rgba(67, 233, 123, 0.4)'
            },
            backend: {
                backgroundColor: '#fa709a',
                borderColor: '#fa709a',
                shape: '10px',
                shadowColor: 'rgba(250, 112, 154, 0.4)'
            },
            external: {
                backgroundColor: '#a8edea',
                borderColor: '#a8edea',
                shape: '6px',
                shadowColor: 'rgba(168, 237, 234, 0.4)'
            },
            queue: {
                backgroundColor: '#ffecd2',
                borderColor: '#ffecd2',
                shape: '20px',
                shadowColor: 'rgba(255, 236, 210, 0.4)'
            },
            cache: {
                backgroundColor: '#ff9a9e',
                borderColor: '#ff9a9e',
                shape: '18px',
                shadowColor: 'rgba(255, 154, 158, 0.4)'
            },
            default: {
                backgroundColor: '#667eea',
                borderColor: '#667eea',
                shape: '8px',
                shadowColor: 'rgba(102, 126, 234, 0.3)'
            }
        };
        
        return nodeStyles[nodeType as keyof typeof nodeStyles] || nodeStyles.default;
    };
    
    const nodeStyle = getNodeStyle();
    const nodeType = (data.nodeType || data.type)?.toLowerCase() || 'default';
    const isDatabase = nodeType === 'database';
    const isActor = nodeType === 'actor';
    
    // Actor human shape styling
    if (isActor) {
        return (
            <div
                className={`custom-node ${nodeType} ${selected ? 'selected' : ''}`}
                style={{
                    position: 'relative',
                    width: '200px',
                    height: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    transform: selected ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
                    transition: 'transform 0.2s ease',
                }}
            >
                {/* Actor head */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '50px',
                    height: '50px',
                    background: nodeStyle.backgroundColor,
                    borderRadius: '50%',
                    border: `${selected ? '3' : '2'}px solid ${nodeStyle.borderColor}`,
                    boxShadow: selected 
                        ? `0 6px 20px ${nodeStyle.shadowColor}, 0 0 0 3px ${nodeStyle.borderColor}33`
                        : `0 3px 12px ${nodeStyle.shadowColor}`,
                    backdropFilter: 'blur(10px)',
                }} />
                
                {/* Actor torso */}
                <div style={{
                    position: 'absolute',
                    top: '60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '140px',
                    height: '100px',
                    background: nodeStyle.backgroundColor,
                    borderRadius: '20px 20px 40px 40px',
                    border: `${selected ? '3' : '2'}px solid ${nodeStyle.borderColor}`,
                    boxShadow: selected 
                        ? `0 8px 25px ${nodeStyle.shadowColor}, 0 0 0 3px ${nodeStyle.borderColor}33`
                        : `0 4px 15px ${nodeStyle.shadowColor}`,
                    backdropFilter: 'blur(10px)',
                }} />
                
                {/* Content container */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '70px 24px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }}>
                    
                    {/* Node Title */}
                    <div style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        lineHeight: '1.2',
                        marginBottom: '2px',
                        wordBreak: 'break-word',
                        maxWidth: '100%',
                        color: 'white',
                        textShadow: '0 1px 2px rgba(0,0,0,0.4)'
                    }}>
                        {data.name}
                    </div>
                    
                    {/* Node Type */}
                    <div style={{
                        fontSize: '9px',
                        fontWeight: '500',
                        lineHeight: '1.1',
                        marginBottom: data.description ? '4px' : '0',
                        wordBreak: 'break-word',
                        maxWidth: '100%',
                        color: 'rgba(255, 255, 255, 0.85)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                        [ACTOR]
                    </div>
                    
                    {/* Description */}
                    {data.description && (
                        <div style={{
                            fontSize: '8px',
                            opacity: 0.8,
                            fontWeight: '400',
                            lineHeight: '1.3',
                            textAlign: 'center',
                            maxWidth: '100%',
                            wordBreak: 'break-word',
                            color: 'rgba(255, 255, 255, 0.9)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                            marginTop: '2px'
                        }}>
                            {data.description}
                        </div>
                    )}
                </div>
                
                {/* Hidden Handles for actor nodes */}
                <Handle 
                    type="target" 
                    position={Position.Top} 
                    id="top" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
                <Handle 
                    type="source" 
                    position={Position.Top} 
                    id="top-source" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
                <Handle 
                    type="target" 
                    position={Position.Right} 
                    id="right" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
                <Handle 
                    type="source" 
                    position={Position.Right} 
                    id="right-source" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
                <Handle 
                    type="target" 
                    position={Position.Bottom} 
                    id="bottom" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
                <Handle 
                    type="source" 
                    position={Position.Bottom} 
                    id="bottom-source" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
                <Handle 
                    type="target" 
                    position={Position.Left} 
                    id="left" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
                <Handle 
                    type="source" 
                    position={Position.Left} 
                    id="left-source" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
            </div>
        );
    }
    
    // Database cylinder styling
    if (isDatabase) {
        return (
            <div
                className={`custom-node ${nodeType} ${selected ? 'selected' : ''}`}
                style={{
                    position: 'relative',
                    width: '180px',
                    height: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    transform: selected ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
                    transition: 'transform 0.2s ease',
                }}
            >
                {/* Database cylinder shape */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: nodeStyle.backgroundColor,
                    borderRadius: '90px / 20px',
                    border: `${selected ? '3' : '2'}px solid ${nodeStyle.borderColor}`,
                    boxShadow: selected 
                        ? `0 8px 25px ${nodeStyle.shadowColor}, 0 0 0 3px ${nodeStyle.borderColor}33`
                        : `0 4px 15px ${nodeStyle.shadowColor}`,
                    backdropFilter: 'blur(10px)',
                }} />
                
                {/* Top ellipse */}
                <div style={{
                    position: 'absolute',
                    top: '-2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '176px',
                    height: '24px',
                    background: nodeStyle.backgroundColor,
                    borderRadius: '50%',
                    border: `${selected ? '3' : '2'}px solid ${nodeStyle.borderColor}`,
                    boxShadow: `0 2px 8px ${nodeStyle.shadowColor}`,
                }} />
                
                {/* Content container */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '20px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }}>
                    
                    {/* Node Title */}
                    <div style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        lineHeight: '1.2',
                        marginBottom: '3px',
                        wordBreak: 'break-word',
                        maxWidth: '100%',
                        color: 'white',
                        textShadow: '0 1px 2px rgba(0,0,0,0.4)'
                    }}>
                        {data.name}
                    </div>
                    
                    {/* Node Type */}
                    <div style={{
                        fontSize: '9px',
                        fontWeight: '500',
                        lineHeight: '1.1',
                        marginBottom: data.description ? '6px' : '0',
                        wordBreak: 'break-word',
                        maxWidth: '100%',
                        color: 'rgba(255, 255, 255, 0.85)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                        [DATABASE]
                    </div>
                    
                    {/* Description */}
                    {data.description && (
                        <div style={{
                            fontSize: '8px',
                            opacity: 0.8,
                            fontWeight: '400',
                            lineHeight: '1.3',
                            textAlign: 'center',
                            maxWidth: '100%',
                            wordBreak: 'break-word',
                            color: 'rgba(255, 255, 255, 0.9)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                            marginTop: '2px'
                        }}>
                            {data.description}
                        </div>
                    )}
                </div>
                
                {/* Hidden Handles for database nodes */}
                <Handle 
                    type="target" 
                    position={Position.Top} 
                    id="top" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
                <Handle 
                    type="source" 
                    position={Position.Top} 
                    id="top-source" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
                <Handle 
                    type="target" 
                    position={Position.Right} 
                    id="right" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
                <Handle 
                    type="source" 
                    position={Position.Right} 
                    id="right-source" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
                <Handle 
                    type="target" 
                    position={Position.Bottom} 
                    id="bottom" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
                <Handle 
                    type="source" 
                    position={Position.Bottom} 
                    id="bottom-source" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
                <Handle 
                    type="target" 
                    position={Position.Left} 
                    id="left" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
                <Handle 
                    type="source" 
                    position={Position.Left} 
                    id="left-source" 
                    style={{
                        opacity: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '12px',
                        height: '12px',
                        boxShadow: 'none'
                    }}
                />
            </div>
        );
    }
    
    // Regular node styling for non-database nodes
    return (
        <div
            className={`custom-node ${nodeType} ${selected ? 'selected' : ''}`}
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
            
            {/* Node Title */}
            <div style={{
                fontSize: '15px',
                fontWeight: '700',
                lineHeight: '1.2',
                marginBottom: '4px',
                wordBreak: 'break-word',
                maxWidth: '100%',
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.4)'
            }}>
                {data.name}
            </div>
            
            {/* Node Type */}
            {(data.nodeType || data.type) && (
                <div style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    lineHeight: '1.1',
                    marginBottom: data.description ? '8px' : '0',
                    wordBreak: 'break-word',
                    maxWidth: '100%',
                    color: 'rgba(255, 255, 255, 0.85)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                    [{data.nodeType || data.type}]
                </div>
            )}
            
            {/* Description */}
            {data.description && (
                <div style={{
                    fontSize: '10px',
                    opacity: 0.8,
                    fontWeight: '400',
                    lineHeight: '1.3',
                    textAlign: 'center',
                    maxWidth: '100%',
                    wordBreak: 'break-word',
                    color: 'rgba(255, 255, 255, 0.9)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    marginTop: '4px'
                }}>
                    {data.description}
                </div>
            )}
            
            {/* Hidden Handles - invisible but functional for connections */}
            <Handle 
                type="target" 
                position={Position.Top} 
                id="top" 
                style={{
                    opacity: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '12px',
                    height: '12px',
                    boxShadow: 'none'
                }}
            />
            <Handle 
                type="source" 
                position={Position.Top} 
                id="top-source" 
                style={{
                    opacity: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '12px',
                    height: '12px',
                    boxShadow: 'none'
                }}
            />
            <Handle 
                type="target" 
                position={Position.Right} 
                id="right" 
                style={{
                    opacity: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '12px',
                    height: '12px',
                    boxShadow: 'none'
                }}
            />
            <Handle 
                type="source" 
                position={Position.Right} 
                id="right-source" 
                style={{
                    opacity: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '12px',
                    height: '12px',
                    boxShadow: 'none'
                }}
            />
            <Handle 
                type="target" 
                position={Position.Bottom} 
                id="bottom" 
                style={{
                    opacity: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '12px',
                    height: '12px',
                    boxShadow: 'none'
                }}
            />
            <Handle 
                type="source" 
                position={Position.Bottom} 
                id="bottom-source" 
                style={{
                    opacity: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '12px',
                    height: '12px',
                    boxShadow: 'none'
                }}
            />
            <Handle 
                type="target" 
                position={Position.Left} 
                id="left" 
                style={{
                    opacity: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '12px',
                    height: '12px',
                    boxShadow: 'none'
                }}
            />
            <Handle 
                type="source" 
                position={Position.Left} 
                id="left-source" 
                style={{
                    opacity: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '12px',
                    height: '12px',
                    boxShadow: 'none'
                }}
            />
        </div>
    );
}

export default memo(CustomNode);