import { ComposedOfRelationship, ConnectsRelationship, DeployedInRelationship, InteractsRelationship, Node, Relationship } from './Types';

export class Translator {
    private nodes: string[] = [];
    private simpleRelationships: string[] = [];
    private deployedInRelationships: string[] = [];

    public addNode(node: Node): void {
        this.nodes.push(node.uniqueId + '[' + node.name + ']');
    }

    public addRelationship(relationship: Relationship): void {
        if (relationship["relationship-type"] === 'connects') {
            this.addConnectsRelationship(relationship);
        } else if (relationship["relationship-type"] === 'interacts') {
            this.addInteractsRelationship(relationship);
        } else if (relationship["relationship-type"] === 'deployed-in') {
            this.addDeployedInRelationship(relationship);
        } else if (relationship["relationship-type"] === 'composed-of') {
            this.addComposedOfRelationship(relationship);
        }
    }

    private addConnectsRelationship(r: ConnectsRelationship): void {
        const label = r["relationship-type"] + ' ' + r.protocol + ' ' + r.authentication;
        this.simpleRelationships.push(r.parties.source + ' -->|' + label + '| ' + r.parties.destination);
    }

    private addInteractsRelationship(r: InteractsRelationship): void {
        r.parties.nodes.map(nodeId => {
            this.simpleRelationships.push(r.parties.actor + ' -->|' + r["relationship-type"] + '|' + nodeId);
        });
    }

    private addDeployedInRelationship(r: DeployedInRelationship): void {
        this.deployedInRelationships.push(`
            subgraph ${r.parties.container} [${r.parties.container}]
                ${r.parties.nodes.join('\n')}
            end
        `);
    }

    private addComposedOfRelationship(r: ComposedOfRelationship): void {
        r.parties.nodes.map(nodeId => {
            this.simpleRelationships.push(r.parties.container + ' -->|' + r["relationship-type"] + '|' + nodeId);
        });
    }

    public getMermaid(): string {
        return `
            flowchart LR
            ${this.nodes.join('\n')}

            ${this.simpleRelationships.join('\n')}

            ${this.deployedInRelationships.join('\n')}
        `;
    }
}