import { CalmComposedOfRelationship, CalmConnectsRelationship, CalmControl, CalmDeployedInRelationship, CalmFlow, CalmInteractsRelationship, CalmMetadata, CalmNode } from './model';

export interface CalmVisitor {
    visitCalmNode(element: CalmNode): void;

    visitCalmConnectsRelationship(element: CalmConnectsRelationship): void;
    visitCalmInteractsRelationship(element: CalmInteractsRelationship): void;
    visitCalmComposedOfRelationship(element: CalmComposedOfRelationship): void;
    visitCalmDeployedInRelationship(element: CalmDeployedInRelationship): void;
    visitCalmMetaData(element: CalmMetadata): void;
    visitCalmControl(element: CalmControl): void;
    visitCalmFlow(element: CalmFlow): void;
}

export class BaseCalmVisitor implements CalmVisitor {
    visitCalmNode(_element: CalmNode): void {}

    visitCalmConnectsRelationship(_element: CalmConnectsRelationship): void {}
    visitCalmInteractsRelationship(_element: CalmInteractsRelationship): void {}
    visitCalmComposedOfRelationship(_element: CalmComposedOfRelationship): void {}
    visitCalmDeployedInRelationship(_element: CalmDeployedInRelationship): void {}
    visitCalmMetaData(_element: CalmMetadata): void {}
    visitCalmControl(_element: CalmControl): void {}
    visitCalmFlow(_element: CalmFlow): void {}
}