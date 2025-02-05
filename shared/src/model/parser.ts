import { CalmNode, CalmItem, CalmConnectsRelationship, CalmInteractsRelationship, CalmDeployedInRelationship, CalmComposedOfRelationship, CalmMetadata, CalmControl, CalmControlRequirement, CalmRelationship, CalmInterface, CalmNodeInterface, CalmFlow, CalmFlowTransition } from './model';

export class CalmParser {
    constructor() {};

    public parse(calmArch: string): CalmItem[] {
        // assuming calmArch is valid CALM
        const calmObj = JSON.parse(calmArch);
    
        const items: CalmItem[] = [];
        
        items.push(...this.parseRelationships(calmObj.relationships));
        items.push(...this.parseNodes(calmObj.nodes));
        items.push(...this.parseMetadata(calmObj.metadata));
        items.push(...this.parseControls(calmObj.controls));
        items.push(...this.parseFlows(calmObj.flows));
    
        return items;
    }

    private parseNodes(nodes: object[]): CalmNode[] {
        return nodes.map(node => new CalmNode(
            node['unique-id'],
            node['name'],
            node['description'],
            node['node-type'],
            node['interfaces'] ?? this.parseInterfaces(node['interfaces']),
            node['controls'] ?? this.parseControls(node['controls']),
            node['detailed-architecture'],
            node['data-classification'],
            node['run-as'],
            node['instance'],
            node['metadata'] ?? this.parseMetadata(node['metadata']),
            node
        ));
    }

    private parseInterfaces(interfaces: object[]): CalmInterface[] {
        return interfaces.map((calmInterface: object) => new CalmInterface(
            calmInterface['unique-id'],
            calmInterface
        ));
    }
    
    private parseRelationships(relationships: object[]): CalmRelationship[] {
        return relationships.map(relationship => {
            if ('connects' in relationship['relationship-type']) {
                return new CalmConnectsRelationship(
                    relationship['unique-id'],
                    relationship['description'],
                    this.parseNodeInterface(relationship['relationship-type']['connects']['source']),
                    this.parseNodeInterface(relationship['relationship-type']['connects']['destination']),
                    relationship['protocol'],
                    relationship['authentication'],
                    this.parseMetadata(relationship['metadata']),
                    this.parseControls(relationship['controls']),
                    relationship
                );
            }
    
            if ('interacts' in relationship['relationship-type']) {
                return new CalmInteractsRelationship(
                    relationship['unique-id'],
                    relationship['description'],
                    relationship['relationship-type']['interacts']['actor'],
                    relationship['relationship-type']['interacts']['nodes'],
                    relationship
                );
            }
    
            if ('deployed-in' in relationship['relationship-type']) {
                return new CalmDeployedInRelationship(
                    relationship['unique-id'],
                    relationship['description'],
                    relationship['relationship-type']['deployed-in']['container'],
                    relationship['relationship-type']['deployed-in']['nodes'],
                    relationship
                );
            }
    
            if ('composed-of' in relationship['relationship-type']) {
                return new CalmComposedOfRelationship(
                    relationship['unique-id'],
                    relationship['description'],
                    relationship['relationship-type']['composed-of']['container'],
                    relationship['relationship-type']['composed-of']['nodes'],
                    relationship
                );
            }
        });
    }

    private parseNodeInterface(nodeInterface: object): CalmNodeInterface {
        return new CalmNodeInterface(
            nodeInterface['node'],
            nodeInterface['interfaces'] || [],
            nodeInterface
        );
    }
    
    private parseMetadata(metadata?: unknown[]): CalmMetadata[] {
        if (!metadata) return [];
    
        return metadata.map(field => new CalmMetadata(field));
    }
    
    private parseControls(controlObject?: object): CalmControl[] {
        if (!controlObject) return [];

        const controls: CalmControl[] = [];
    
        Object.keys(controlObject).forEach(controlId => {
            controls.push(new CalmControl(
                controlId,
                controlObject[controlId]['description'],
                this.parseControlRequirements(controlObject[controlId]['requirements']),
                controlObject[controlId]
            ));
        });

        return controls;
    }

    private parseControlRequirements(controlRequirements: object[]): CalmControlRequirement[] {
        return controlRequirements.map(controlRequirement => new CalmControlRequirement(
            controlRequirement['control-requirement-url'],
            controlRequirement['control-config-url']
        ));
    }
    
    private parseFlows(flows: object[]): CalmItem[] {
        return flows.map(flow => new CalmFlow(
            flow['unique-id'],
            flow['name'],
            flow['description'],
            this.parseFlowTransitions(flow['transitions']),
            flow
        ));
    }

    private parseFlowTransitions(flowTransitions: object[]): CalmFlowTransition[] {
        return flowTransitions.map(flowTransition => new CalmFlowTransition(
            flowTransition['relationship-unique-id'],
            flowTransition['sequence-number'],
            flowTransition['summary'],
            flowTransition['direction']
        ));
    }
}