import { SchemaDirectory } from '../commands/generate/schema-directory';
import { CalmNode, CalmItem, CalmConnectsRelationship, CalmInteractsRelationship, CalmDeployedInRelationship, CalmComposedOfRelationship, CalmMetadata, CalmControl, CalmControlRequirement, CalmRelationship, CalmInterface } from './model';

export class CalmParser {
    constructor(private schemaDirectory: SchemaDirectory) {};

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
                    relationship['relationship-type']['connects']['source']['node'],
                    relationship['relationship-type']['connects']['destination']['node'],
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
    
    private parseMetadata(metadata?: unknown[]): CalmMetadata[] {
        if (!metadata) return [];
    
        return metadata.map(field => new CalmMetadata(field));
    }
    
    private parseControls(controlObject?: object): CalmItem[] {
        if (!controlObject) return [];

        const controls: CalmItem[] = [];
    
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
    
    private parseFlows(_flows: object[]): CalmItem[] {
        return [];
    }
}