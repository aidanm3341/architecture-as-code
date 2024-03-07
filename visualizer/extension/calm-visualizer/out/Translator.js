"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translator = void 0;
class Translator {
    nodes = [];
    simpleRelationships = [];
    deployedInRelationships = [];
    addNode(node) {
        this.nodes.push(node.uniqueId + '[' + node.name + ']');
    }
    addRelationship(relationship) {
        if (relationship["relationship-type"] === 'connects') {
            this.addConnectsRelationship(relationship);
        }
        else if (relationship["relationship-type"] === 'interacts') {
            this.addInteractsRelationship(relationship);
        }
        else if (relationship["relationship-type"] === 'deployed-in') {
            this.addDeployedInRelationship(relationship);
        }
        else if (relationship["relationship-type"] === 'composed-of') {
            this.addComposedOfRelationship(relationship);
        }
    }
    addConnectsRelationship(r) {
        const label = r["relationship-type"] + ' ' + r.protocol + ' ' + r.authentication;
        this.simpleRelationships.push(r.parties.source + ' -->|' + label + '| ' + r.parties.destination);
    }
    addInteractsRelationship(r) {
        r.parties.nodes.map(nodeId => {
            this.simpleRelationships.push(r.parties.actor + ' -->|' + r["relationship-type"] + '|' + nodeId);
        });
    }
    addDeployedInRelationship(r) {
        this.deployedInRelationships.push(`
            subgraph ${r.parties.container} [${r.parties.container}]
                ${r.parties.nodes.join('\n')}
            end
        `);
    }
    addComposedOfRelationship(r) {
        r.parties.nodes.map(nodeId => {
            this.simpleRelationships.push(r.parties.container + ' -->|' + r["relationship-type"] + '|' + nodeId);
        });
    }
    getMermaid() {
        return `
            flowchart LR
            ${this.nodes.join('\n')}

            ${this.simpleRelationships.join('\n')}

            ${this.deployedInRelationships.join('\n')}
        `;
    }
}
exports.Translator = Translator;
//# sourceMappingURL=Translator.js.map