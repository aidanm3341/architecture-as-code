import { memo } from 'react';
import { getStraightPath, EdgeProps } from 'reactflow';

function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}: EdgeProps) {
    const [edgePath] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    // Calculate the proper arrow rotation based on the actual edge direction
    const deltaX = targetX - sourceX;
    const deltaY = targetY - sourceY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // Create a custom marker ID for this edge
    const markerId = `arrow-${id}`;

    return (
        <>
            {/* Define custom marker with correct rotation */}
            <defs>
                <marker
                    id={markerId}
                    markerWidth="20"
                    markerHeight="20"
                    refX="18"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <polygon
                        points="0,0 0,6 9,3"
                        fill={style.stroke || '#666'}
                        stroke={style.stroke || '#666'}
                    />
                </marker>
            </defs>
            
            <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={`url(#${markerId})`}
            />
        </>
    );
}

export default memo(CustomEdge);