import { CalmNode, CalmConnectsRelationship, CalmInteractsRelationship, CalmComposedOfRelationship, CalmDeployedInRelationship, CalmItem, CalmMetadata, CalmControl, CalmFlow } from './model';
import { CalmVisitor } from './visitor';

class CalmPrinter implements CalmVisitor {
    visitCalmNode(element: CalmNode): void {
        console.log(element.uniqueId);
    }

    visitCalmConnectsRelationship(element: CalmConnectsRelationship): void {
        console.log(element.uniqueId);
    }

    visitCalmInteractsRelationship(element: CalmInteractsRelationship): void {
        console.log(element.uniqueId);
    }

    visitCalmComposedOfRelationship(element: CalmComposedOfRelationship): void {
        console.log(element.uniqueId);
    }

    visitCalmDeployedInRelationship(element: CalmDeployedInRelationship): void {
        console.log(element.uniqueId);
    }

    visitCalmMetaData(element: CalmMetadata): void {
        console.log(element.originalJson);
    }

    visitCalmControl(element: CalmControl): void {
        console.log(element.controlId);
    }

    visitCalmFlow(element: CalmFlow): void {
        console.log(element.uniqueId);
    }
}

const calmStuff: CalmItem[] = [
    new CalmNode('node-1', 'Node 1', 'This is the first node', 'service', undefined, undefined, {}),
    new CalmNode('node-2', 'Node 2', 'This is the second node', 'system', undefined, undefined, {}),
    new CalmConnectsRelationship(
        'node-1-node-2', 
        'some description', 
        {node: 'node-1', interfaces: [], originalJson: {}}, 
        {node: 'node-2', interfaces: [], originalJson: {}}, 
        {}
    )
];

const visitor = new CalmPrinter();
calmStuff.forEach(calmItem => calmItem.accept(visitor));