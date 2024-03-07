import { Translator } from './Translator';
import { CALMManifest } from './Types';

export function convert(input: string) {
    const calm: CALMManifest = JSON.parse(input);
    const translator: Translator = new Translator();

    calm.nodes.map(node => {
        translator.addNode(node);
    });

    calm.relationships.map(relationship => {
        translator.addRelationship(relationship);
    });

    return translator.getMermaid();
}