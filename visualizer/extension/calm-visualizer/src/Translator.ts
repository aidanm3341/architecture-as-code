import { ComposedOfRelationship, ConnectsRelationship, DeployedInRelationship, InteractsRelationship, Node, Relationship } from './Types';

export class Translator {
    private nodes: string[] = [];
    private simpleRelationships: string[] = [];
    private subgraphRelationships: string[] = [];

    private styles: string[] = [];

    public addNode(node: Node): void {
        this.nodes.push(node.uniqueId + '[' + node.name + ']');
    }

    public addRelationship(relationship: Relationship): void {
        if ('connects' in relationship['relationship-type']) {
            this.addConnectsRelationship(relationship as ConnectsRelationship);
        } else if ('interacts' in relationship["relationship-type"]) {
            this.addInteractsRelationship(relationship as InteractsRelationship);
        } else if ('deployed-in' in relationship["relationship-type"]) {
            this.addDeployedInRelationship(relationship as DeployedInRelationship);
        } else if ('composed-of' in relationship["relationship-type"]) {
            this.addComposedOfRelationship(relationship as ComposedOfRelationship);
        }
    }

    private addConnectsRelationship(r: ConnectsRelationship): void {
        const label = 'connects ' + r.protocol + ' ' + r.authentication;
        this.simpleRelationships.push(r['relationship-type']['connects'].source + ' -->|' + label + '| ' + r['relationship-type']['connects'].destination);
    }

    private addInteractsRelationship(r: InteractsRelationship): void {
        r['relationship-type']['interacts'].nodes.map(nodeId => {
            this.simpleRelationships.push(r['relationship-type']['interacts'].actor + ' -->|interacts|' + nodeId);
        });
    }

    private addDeployedInRelationship(r: DeployedInRelationship): void {
        this.subgraphRelationships.push(`
            subgraph ${r['relationship-type']['deployed-in'].container} [${r['relationship-type']['deployed-in'].container}]
                ${r['relationship-type']['deployed-in'].nodes.join('\n')}
            end
        `);
        this.styles.push(`style ${r['relationship-type']['deployed-in'].container} stroke-dasharray: 5 5`);
        this.styles.push(`style ${r['relationship-type']['deployed-in'].container} fill: none`);
    }

    private addComposedOfRelationship(r: ComposedOfRelationship): void {
        this.subgraphRelationships.push(`
            subgraph ${r['relationship-type']['composed-of'].container} [${r['relationship-type']['composed-of'].container}]
                ${r['relationship-type']['composed-of'].nodes.join('\n')}
            end
        `);
        this.styles.push(`style ${r['relationship-type']['composed-of'].container} stroke-dasharray: 5 5`);
        this.styles.push(`style ${r['relationship-type']['composed-of'].container} fill: none`);
    }

    public getMermaid(): string {
        return `
            flowchart LR
            ${this.nodes.join('\n')}

            ${this.simpleRelationships.join('\n')}

            ${this.subgraphRelationships.join('\n')}

            ${this.styles.join('\n')}
        `;
    }
}