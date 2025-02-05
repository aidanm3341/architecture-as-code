import { CalmVisitor } from './visitor';

export interface CalmItem {
    accept(visitor: CalmVisitor): void;
}

export type CalmNodeType = 'actor' | 'system' | 'service' | 'database' | 'network' | 'ldap' | 'dataclient';
export type CalmDataClassification = 'Public' | 'Confidential' | 'Highly Restricted' | 'MNPI' | 'PII';

export class CalmNode implements CalmItem {
    constructor(
        public uniqueId: string,
        public name: string,
        public description: string,
        public type: CalmNodeType,
        public interfaces: unknown[] | undefined,
        public controls: unknown | undefined,
        public detailedArchitecture: string | undefined,
        public dataClassification: CalmDataClassification | undefined,
        public runAs: string | undefined,
        public instance: string | undefined,
        public metadata: CalmMetadata[] | undefined,
        public originalJson: object
    ){};

    accept(visitor: CalmVisitor): void {
        visitor.visitCalmNode(this);
    }
}

export class CalmInterface {
    constructor(
        public type: string,
        public originalJson: object
    ){};
}

export type CalmRelationship = CalmConnectsRelationship | CalmInteractsRelationship | CalmDeployedInRelationship | CalmComposedOfRelationship;

export type CalmRelationshipProtocol = 'HTTP' | 'HTTPS' | 'FTP' | 'SFTP' | 'JDBC' | 'WebSocket' | 'SocketIO' | 'LDAP' | 'AMQP' | 'TLS' | 'mTLS' | 'TCP';

export type CalmRelationshipAuthentication = 'Basic' | 'OAuth2' | 'Kerberos' | 'SPNEGO' | 'Certificate';

export class CalmConnectsRelationship implements CalmItem {
    constructor(
        public uniqueId: string,
        public description: string,
        public source: CalmNodeInterface,
        public target: CalmNodeInterface,
        public protocol: CalmRelationshipProtocol | undefined,
        public authentication: CalmRelationshipAuthentication | undefined,
        public metadata: CalmMetadata[] | undefined,
        public controls: CalmControl[] | undefined,
        public originalJson: object
    ){};

    accept(visitor: CalmVisitor): void {
        visitor.visitCalmConnectsRelationship(this);
    }
}

export class CalmNodeInterface {
    constructor(
        public node: string,
        public interfaces: string[],
        public originalJson: object
    ){};
}

export class CalmInteractsRelationship implements CalmItem {
    constructor(
        public uniqueId: string,
        public description: string,
        public actor: string,
        public nodes: string[],
        public originalJson: object
    ){};

    accept(visitor: CalmVisitor): void {
        visitor.visitCalmInteractsRelationship(this);
    }
}

export class CalmComposedOfRelationship implements CalmItem {
    constructor(
        public uniqueId: string,
        public description: string,
        public container: string,
        public nodes: string[],
        public originalJson: object
    ){};

    accept(visitor: CalmVisitor): void {
        visitor.visitCalmComposedOfRelationship(this);
    }
}

export class CalmDeployedInRelationship implements CalmItem {
    constructor(
        public uniqueId: string,
        public description: string,
        public container: string,
        public nodes: string[],
        public originalJson: object
    ){};

    accept(visitor: CalmVisitor): void {
        visitor.visitCalmDeployedInRelationship(this);
    }
}

export class CalmMetadata implements CalmItem {
    constructor(
        public originalJson: unknown
    ){};

    accept(visitor: CalmVisitor): void {
        visitor.visitCalmMetaData(this);
    }
}

export class CalmControlRequirement {
    constructor(
        public controlRequirementUrl: string,
        public controlConfigUrl: string
    ){};
}

export class CalmControl implements CalmItem {
    constructor(
        public controlId: string,
        public description: string,
        public requirements: CalmControlRequirement[],
        public originalJson: string
    ){};

    accept(visitor: CalmVisitor): void {
        visitor.visitCalmControl(this);
    }
}

export class CalmFlow implements CalmItem {
    constructor(
        public uniqueId: string,
        public name: string,
        public description: string,
        public transitions: CalmFlowTransition[],
        public originalJson: object
    ){};

    accept(visitor: CalmVisitor): void {
        visitor.visitCalmFlow(this);
    }
}

export class CalmFlowTransition {
    constructor(
        public relationshipUniqueId: string,
        public sequenceNumber: number,
        public summary: string,
        public direction: CalmFlowTransitionDirection = 'source-to-destination'
    ){};
}

export type CalmFlowTransitionDirection = 'source-to-destination' | 'destination-to-source';