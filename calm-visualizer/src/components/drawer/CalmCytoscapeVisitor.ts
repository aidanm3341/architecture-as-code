import { SchemaDirectory } from "../../../../shared/src/commands/generate/schema-directory";
import { BaseCalmVisitor, CalmNode, CalmInteractsRelationship, CalmConnectsRelationship, CalmParser } from "../../../../shared/src/model";
import { CalmComposedOfRelationship, CalmDeployedInRelationship, CalmItem } from "../../../../shared/src/model/model";
import { Edge, Node } from "../cytoscape-renderer/CytoscapeRenderer";

export class CalmCytoscapeVisitor extends BaseCalmVisitor {
    private nodes: Node[] = [];
    private edges: Edge[] = [];

    private parents: string[] = [];
    private parentChildRelationships: {childId: string, parentId: string}[] = [];

    constructor(calm: string) {
        super();
        new CalmParser(new SchemaDirectory()).parse(calm).forEach((item: CalmItem) => item.accept(this));
    }

    public visitCalmNode(element: CalmNode): void {
        const nodeType = this.parents.includes(element.uniqueId) ? 'group' : 'node';

        const parentChildRelationship = this.parentChildRelationships.find(rel => rel.childId == element.uniqueId);
        const parent: string | undefined = parentChildRelationship?.parentId;

        this.nodes.push({
            classes: nodeType,
            data: {
                id: element.uniqueId,
                label: element.name,
                description: element.description,
                type: element.type,
                parent: parent
            }
        });
    }

    public visitCalmComposedOfRelationship(element: CalmComposedOfRelationship): void {
        element.nodes.forEach(node => {
            this.parentChildRelationships.push({childId: node, parentId: element.container});
        });
        this.parents.push(element.container);
    }

    public visitCalmDeployedInRelationship(element: CalmDeployedInRelationship): void {
        element.nodes.forEach(node => {
            this.parentChildRelationships.push({childId: node, parentId: element.container});
        });
        this.parents.push(element.container);
    }

    public visitCalmInteractsRelationship(element: CalmInteractsRelationship): void {
        element.nodes.forEach(node => {
            this.edges.push({
                data: {
                    id: element.uniqueId, // same unique ID for each line?
                    label: element.description,
                    source: element.actor,
                    target: node
                }
            });
        });
    }

    public visitCalmConnectsRelationship(element: CalmConnectsRelationship): void {
        this.edges.push({
            data: {
                id: element.uniqueId,
                label: element.description,
                source: element.source.node,
                target: element.target.node
            }
        });
    }

    public getNodes(): Node[] {
        return this.nodes;
    }

    public getEdges(): Edge[] {
        return this.edges;
    } 
}