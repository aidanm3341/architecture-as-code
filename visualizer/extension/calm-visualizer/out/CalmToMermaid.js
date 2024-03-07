"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = void 0;
const Translator_1 = require("./Translator");
function convert(input) {
    const calm = JSON.parse(input);
    const translator = new Translator_1.Translator();
    calm.nodes.map(node => {
        translator.addNode(node);
    });
    calm.relationships.map(relationship => {
        translator.addRelationship(relationship);
    });
    return translator.getMermaid();
}
exports.convert = convert;
//# sourceMappingURL=CalmToMermaid.js.map