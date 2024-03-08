import { MermaidBuilder } from './MermaidBuilder';
import { CALMManifest } from './Types';

export function convert(input: string) {
    const calm: CALMManifest = JSON.parse(input);
    const mermaidBuilder: MermaidBuilder = new MermaidBuilder();

    calm.nodes.map(node => {
        mermaidBuilder.addNode(node);
    });

    calm.relationships.map(relationship => {
        mermaidBuilder.addRelationship(relationship);
    });

    return mermaidBuilder.getMermaid();
}