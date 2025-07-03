import { useCallback, useState } from 'react';
import { ReactFlowNode, ReactFlowEdge } from '../../contracts/contracts.js';
import { Sidebar } from '../sidebar/Sidebar.js';
import { ReactFlowRenderer } from '../reactflow-renderer/ReactFlowRenderer.js';

interface GroupData {
    id: string;
    label: string;
    description?: string;
    type: 'composed-of' | 'deployed-in';
    memberNodeIds: string[];
}

interface VisualizerContainerProps {
    title?: string;
    isNodeDescActive: boolean;
    isRelationshipDescActive: boolean;
    nodes: ReactFlowNode[];
    edges: ReactFlowEdge[];
    groups?: GroupData[];
    calmKey: string;
}

export function VisualizerContainer({
    title = '',
    nodes = [],
    edges = [],
    groups = [],
    isRelationshipDescActive,
    isNodeDescActive,
    calmKey,
}: VisualizerContainerProps) {
    const [selectedItem, setSelectedItem] = useState<ReactFlowNode['data'] | ReactFlowEdge['data'] | null>(
        null
    );

    const entityClickedCallback = useCallback((x: ReactFlowNode['data'] | ReactFlowEdge['data']) => setSelectedItem(x), []);

    return (
        <div className="relative flex m-auto border" data-testid="visualizer-container">
            {title && (
                <div className="graph-title absolute m-5 bg-accent shadow-md z-10">
                    <span className="text-m font-thin text-primary-content">Architecture: </span>
                    <span className="text-m font-semibold text-primary-content">{title}</span>
                </div>
            )}
            <ReactFlowRenderer
                isNodeDescActive={isNodeDescActive}
                isRelationshipDescActive={isRelationshipDescActive}
                nodes={nodes}
                edges={edges}
                groups={groups}
                nodeClickedCallback={entityClickedCallback}
                edgeClickedCallback={entityClickedCallback}
                calmKey={calmKey}
            />
            {selectedItem && (
                <Sidebar
                    selectedData={(() => {
                        // Note: remove reactFlowProps from the data before passing to sidebar
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { reactFlowProps, ...nodeData } = selectedItem;
                        return nodeData;
                    })()}
                    closeSidebar={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}
