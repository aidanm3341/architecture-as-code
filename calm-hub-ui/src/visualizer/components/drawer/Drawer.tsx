import { Sidebar } from '../sidebar/Sidebar.js';
import { useState } from 'react';
import {
    CalmArchitectureSchema,
    CalmNodeSchema,
    CalmRelationshipSchema,
} from '../../../../../shared/src/types/core-types.js';
import {
    CALMDeployedInRelationship,
    CALMComposedOfRelationship,
    CALMConnectsRelationship,
    CALMInteractsRelationship,
} from '../../../../../shared/src/types.js';
import { ReactFlowNode, ReactFlowEdge } from '../../contracts/contracts.js';
import { VisualizerContainer } from '../visualizer-container/VisualizerContainer.js';
import { Data } from '../../../model/calm.js';

interface DrawerProps {
    calmInstance?: CalmArchitectureSchema;
    title: string;
    isNodeDescActive: boolean;
    isConDescActive: boolean;
    data?: Data;
}

function isComposedOf(
    relationship: CalmRelationshipSchema
): relationship is CALMComposedOfRelationship {
    return 'composed-of' in relationship['relationship-type'];
}

function isDeployedIn(
    relationship: CalmRelationshipSchema
): relationship is CALMDeployedInRelationship {
    return 'deployed-in' in relationship['relationship-type'];
}

function isInteracts(
    relationship: CalmRelationshipSchema
): relationship is CALMInteractsRelationship {
    return 'interacts' in relationship['relationship-type'];
}

function isConnects(
    relationship: CalmRelationshipSchema
): relationship is CALMConnectsRelationship {
    return 'connects' in relationship['relationship-type'];
}

function hasOptions(relationship: CalmRelationshipSchema): boolean {
    return 'options' in relationship['relationship-type'];
}

function getComposedOfRelationships(calmInstance: CalmArchitectureSchema) {
    const composedOfRelationships: {
        [idx: string]: {
            type: 'parent' | 'child';
            parent?: string;
        };
    } = {};

    calmInstance.relationships?.forEach((relationship) => {
        if (isComposedOf(relationship)) {
            const rel = relationship['relationship-type']['composed-of'];
            composedOfRelationships[rel!['container']] = { type: 'parent' };
            rel!['nodes'].forEach((node) => {
                composedOfRelationships[node] = {
                    type: 'child',
                    parent: rel!['container'],
                };
            });
        }
    });

    return composedOfRelationships;
}

function getDeployedInRelationships(calmInstance: CalmArchitectureSchema) {
    const deployedInRelationships: {
        [idx: string]: {
            type: 'parent' | 'child';
            parent?: string;
        };
    } = {};
    calmInstance.relationships?.forEach((relationship) => {
        if (isDeployedIn(relationship)) {
            const rel = relationship['relationship-type']['deployed-in'];
            deployedInRelationships[rel['container']] = { type: 'parent' };
            rel['nodes'].forEach((node) => {
                deployedInRelationships[node] = {
                    type: 'child',
                    parent: rel['container'],
                };
            });
        }
    });

    return deployedInRelationships;
}

function getGroupData(calmInstance: CalmArchitectureSchema) {
    const groups: Array<{
        id: string;
        label: string;
        description?: string;
        type: 'composed-of' | 'deployed-in';
        memberNodeIds: string[];
    }> = [];

    calmInstance.relationships?.forEach((relationship) => {
        if (isComposedOf(relationship)) {
            const rel = relationship['relationship-type']['composed-of'];
            groups.push({
                id: relationship['unique-id'],
                label: rel.container,
                description: relationship.description,
                type: 'composed-of',
                memberNodeIds: rel.nodes,
            });
        }
        
        if (isDeployedIn(relationship)) {
            const rel = relationship['relationship-type']['deployed-in'];
            groups.push({
                id: relationship['unique-id'],
                label: rel.container,
                description: relationship.description,
                type: 'deployed-in',
                memberNodeIds: rel.nodes,
            });
        }
    });

    return groups;
}

export function Drawer({
    calmInstance,
    title,
    isConDescActive,
    isNodeDescActive,
    data,
}: DrawerProps) {
    const [selectedNode, setSelectedNode] = useState<ReactFlowNode | null>(null);

    function closeSidebar() {
        setSelectedNode(null);
    }

    function generateDisplayPlaceHolderWithoutDesc(node: CalmNodeSchema): string {
        return `${node.name}\n[${node['node-type']}]`;
    }

    function getNodes(): ReactFlowNode[] {
        if (!calmInstance || !calmInstance.relationships) return [];

        const composedOfRelationships = getComposedOfRelationships(calmInstance);
        const deployedInRelationships = getDeployedInRelationships(calmInstance);

        return (calmInstance.nodes ?? []).map((node) => {
            const newData: ReactFlowNode = {
                data: {
                    id: node['unique-id'],
                    name: node.name,
                    description: node.description,
                    type: node['node-type'],
                    reactFlowProps: {
                        labelWithDescription: `${generateDisplayPlaceHolderWithoutDesc(node)}\n\n${node.description}\n`,
                        labelWithoutDescription: `${generateDisplayPlaceHolderWithoutDesc(node)}`,
                    },
                },
                position: {
                    x: Math.random() * 500,
                    y: Math.random() * 500,
                },
            };

            if (node.interfaces) {
                newData.data.interfaces = node.interfaces;
            }

            if (node.controls) {
                newData.data.controls = node.controls;
            }

            // No longer set parent relationships - we'll handle grouping visually
            return newData;
        });
    }

    function getEdges(): ReactFlowEdge[] {
        if (!calmInstance || !calmInstance.relationships) return [];

        const edges: ReactFlowEdge[] = [];

        calmInstance.relationships.forEach((relationship, index) => {
            if (isInteracts(relationship)) {
                const rel = relationship['relationship-type'].interacts;
                // Create an edge for each target node - use original node IDs
                rel.nodes.forEach((targetNode) => {
                    const edge = {
                        data: {
                            id: `${relationship['unique-id']}-${targetNode}`,
                            label: relationship.description || '',
                            source: rel.actor,
                            target: targetNode,
                            relationshipType: 'interacts-with',
                        },
                    } as ReactFlowEdge;
                    edges.push(edge);
                });
            }
            
            if (isConnects(relationship)) {
                const rel = relationship['relationship-type'].connects;
                // Use original node IDs for connects relationships
                const edge = {
                    data: {
                        id: relationship['unique-id'],
                        label: relationship.description || '',
                        source: rel.source.node,
                        target: rel.destination.node,
                        relationshipType: 'connects-to',
                    },
                } as ReactFlowEdge;
                edges.push(edge);
            }
            
            // Note: composed-of and deployed-in relationships are now handled visually 
            // through group rectangles rather than edges
            
            if (hasOptions(relationship)) {
                const options = relationship['relationship-type'].options;
                // Create edges to represent options relationships
                if (options && Array.isArray(options)) {
                    options.forEach((optionGroup, groupIndex) => {
                        if (Array.isArray(optionGroup)) {
                            optionGroup.forEach((option, optionIndex) => {
                                if (option.nodes && option.relationships) {
                                    // Create edges between related nodes in the option
                                    option.nodes.forEach((nodeId, nodeIndex) => {
                                        if (nodeIndex < option.nodes.length - 1) {
                                            edges.push({
                                                data: {
                                                    id: `${relationship['unique-id']}-option-${groupIndex}-${optionIndex}-${nodeIndex}`,
                                                    label: option.description || 'option',
                                                    source: nodeId,
                                                    target: option.nodes[nodeIndex + 1],
                                                    relationshipType: 'options',
                                                },
                                            } as ReactFlowEdge);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });

        return edges;
    }

    function createStorageKey(title: string, data?: Data): string {
        if (!data || !data.name || !data.calmType || !data.id || !data.version) {
            return title;
        }
        return `${data.name}/${data.calmType}/${data.id}/${data.version}`;
    }

    const edges = getEdges();
    const nodes = getNodes();
    const groups = calmInstance ? getGroupData(calmInstance) : [];

    return (
        <div className="flex-1 flex overflow-hidden">
            <div className={`drawer drawer-end ${selectedNode ? 'drawer-open' : ''}`}>
                <input
                    type="checkbox"
                    aria-label="drawer-toggle"
                    className="drawer-toggle"
                    checked={!!selectedNode}
                    onChange={closeSidebar}
                />
                <div className="drawer-content">
                    {calmInstance ? (
                        <VisualizerContainer
                            isRelationshipDescActive={isConDescActive}
                            isNodeDescActive={isNodeDescActive}
                            title={title}
                            nodes={nodes}
                            edges={edges}
                            groups={groups}
                            calmKey={createStorageKey(title, data)}
                        />
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            No file selected
                        </div>
                    )}
                </div>
                {selectedNode && (
                    <Sidebar selectedData={selectedNode['data']} closeSidebar={closeSidebar} />
                )}
            </div>
        </div>
    );
}
