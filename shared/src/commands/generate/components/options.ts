import { initLogger } from '../../../logger';

export interface CalmChoice {
    description: string,
    nodes: string[],
    relationships: string[]
}

export interface CalmOption {
    optionType: 'oneOf' | 'anyOf',
    prompt: string,
    choices: CalmChoice[],
}

// Type definitions for JSON Schema-like objects used in patterns
export interface SchemaPropertyBase {
    [key: string]: unknown;
    const?: unknown;
    properties?: Record<string, SchemaPropertyBase>;
    prefixItems?: SchemaPropertyBase[];
}

interface RelationshipSchema extends SchemaPropertyBase {
    properties?: {
        'relationship-type'?: {
            properties?: {
                options?: {
                    prefixItems?: SchemaPropertyBase[];
                };
            };
        };
        description?: {
            const?: string;
        };
        nodes?: {
            const?: string[];
        };
        relationships?: {
            const?: string[];
        };
        'unique-id'?: {
            const?: string;
        };
    };
}

interface PatternSchema extends SchemaPropertyBase {
    properties?: {
        nodes?: {
            prefixItems?: SchemaPropertyBase[];
        };
        relationships?: {
            prefixItems?: RelationshipSchema[];
        };
    };
}

function isOptionsRelationship(relationship: SchemaPropertyBase): boolean {
    const relSchema = relationship as RelationshipSchema;
    return relSchema.properties?.['relationship-type']?.properties?.['options'] !== undefined;
}

function getItemsInOptionsRelationship(optionsRelationship: SchemaPropertyBase): SchemaPropertyBase[] {
    const relSchema = optionsRelationship as RelationshipSchema;
    return relSchema.properties?.['relationship-type']?.properties?.['options']?.prefixItems ?? [];
}

function extractOptionsFromBlock(optionsRelationship: SchemaPropertyBase, blockType: 'oneOf' | 'anyOf'): CalmOption[] {
    const relSchema = optionsRelationship as RelationshipSchema;
    return getItemsInOptionsRelationship(optionsRelationship)
        .filter((prefixItem: SchemaPropertyBase) => blockType in prefixItem)
        .map((prefixItem: SchemaPropertyBase) => {
            const blockData = prefixItem[blockType] as SchemaPropertyBase[];
            return blockData;
        })
        .map((choices: SchemaPropertyBase[]) => ({
            optionType: blockType,
            prompt: relSchema.properties?.description?.const as string ?? '',
            choices: choices.map(choice => {
                const choiceSchema = choice as RelationshipSchema;
                return {
                    description: choiceSchema.properties?.description?.const as string ?? '',
                    nodes: choiceSchema.properties?.nodes?.const as string[] ?? [],
                    relationships: choiceSchema.properties?.relationships?.const as string[] ?? []
                };
            })
        }));
}

/**
 * Extracts the potential choices that a user can make from a pattern
 * @param pattern - The pattern to extract options from
 * @param debug - Whether to enable debug logging
 * @returns A list of options that the user can choose from
 */
export function extractOptions(pattern: SchemaPropertyBase, debug: boolean = false): CalmOption[] {
    const logger = initLogger(debug, 'calm-generate-options');
    const patternSchema = pattern as PatternSchema;
    const calmItems: RelationshipSchema[] = patternSchema.properties?.relationships?.prefixItems ?? [];

    const options: CalmOption[] = calmItems
        .filter((rel: RelationshipSchema) => isOptionsRelationship(rel))
        .flatMap((optionsRel: RelationshipSchema) => [
            ...extractOptionsFromBlock(optionsRel, 'oneOf'),
            ...extractOptionsFromBlock(optionsRel, 'anyOf')
        ]);

    logger.debug(`Found the following options in the pattern: ${options}`);
    return options;
}

type Item = {
    oneOf?: SchemaPropertyBase[],
    anyOf?: SchemaPropertyBase[],
} & SchemaPropertyBase;

/**
 * This function flattens oneOf and anyOf blocks into their constituent items if they match the selection predicate.
 * If the passed item is not a oneOf or anyOf block, it returns the item as is in a list.
 * @param item - The item to flatten
 * @param selectionPredicate - A function that takes an item and returns true if it should be included in the flattened result
 * @returns A list of items that match the selection predicate, or the item itself if it is not a oneOf or anyOf block
 */
function flattenOneOfAndAnyOf(item: Item, selectionPredicate: (item: SchemaPropertyBase) => boolean): SchemaPropertyBase[] {
    if (!(item.oneOf || item.anyOf)) {
        // If it isn't a oneOf or anyOf block, there isn't anything to flatten so return the item
        return [item];
    }

    const items: SchemaPropertyBase[] = item.oneOf ?? item.anyOf ?? [];

    return items
        .flatMap((x: SchemaPropertyBase) => [x])
        .filter((x): x is SchemaPropertyBase => selectionPredicate(x));
}

function flattenCalmItems(pattern: PatternSchema, calmType: 'nodes' | 'relationships', ids: string[]): void {
    const calmItems = pattern.properties?.[calmType]?.prefixItems ?? [];

    const selectionPredicate = (x: SchemaPropertyBase) => {
        const schema = x as RelationshipSchema;
        const uniqueId = schema.properties?.['unique-id']?.const as string;
        return uniqueId ? ids.includes(uniqueId) : false;
    };
    
    if (pattern.properties?.[calmType]) {
        pattern.properties[calmType].prefixItems = calmItems
            .flatMap((item: SchemaPropertyBase) => flattenOneOfAndAnyOf(item as Item, selectionPredicate));
    }
}

function flattenOptionsRelationship(relationship: RelationshipSchema, choices: CalmChoice[]): RelationshipSchema {
    if (!isOptionsRelationship(relationship)) {
        return relationship;
    }

    const selectionPredicate = (x: SchemaPropertyBase) => {
        const schema = x as RelationshipSchema;
        const description = schema.properties?.description?.const as string;
        return description ? choices.map(choice => choice.description).includes(description) : false;
    };
    
    const newItems = getItemsInOptionsRelationship(relationship)
        .flatMap((item: SchemaPropertyBase) => flattenOneOfAndAnyOf(item as Item, selectionPredicate));

    if (relationship.properties?.['relationship-type']?.properties?.['options']) {
        relationship.properties['relationship-type'].properties['options'].prefixItems = newItems;
    }
    return relationship;
}

function flattenOptionsRelationships(pattern: PatternSchema, choices: CalmChoice[]): void {
    if (pattern.properties?.relationships?.prefixItems) {
        pattern.properties.relationships.prefixItems = pattern.properties.relationships.prefixItems
            .map((rel: RelationshipSchema) => flattenOptionsRelationship(rel, choices));
    }
}

/**
 * Selects the choices from the pattern and removes all other choices.
 * @param inputPattern - The input pattern to select choices from
 * @param choices - The choices to select
 * @param debug - Whether to enable debug logging
 * @returns A new pattern object with the selected choices and all oneOf and anyOf blocks flattened
 */
export function selectChoices(inputPattern: SchemaPropertyBase, choices: CalmChoice[], debug: boolean = false): PatternSchema {
    const logger = initLogger(debug, 'calm-generate-options');
    logger.debug(`Selecting these choices from the pattern [${JSON.stringify(choices)}]`);

    const pattern = {...inputPattern} as PatternSchema; // make a copy so we don't mutate the input pattern
    const nodeIds: string[] = choices.flatMap(choice => choice.nodes);
    const relationshipIds: string[] = choices.flatMap(choice => choice.relationships);

    flattenCalmItems(pattern, 'nodes', nodeIds);
    flattenCalmItems(pattern, 'relationships', relationshipIds);

    flattenOptionsRelationships(pattern, choices);
    
    logger.debug(`Pattern with all non chosen choices removed: [${JSON.stringify(pattern)}]`);
    return pattern;
}