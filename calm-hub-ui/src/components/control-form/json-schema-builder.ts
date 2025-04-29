type ConstProperty = {
    label: string;
    type: 'const';
    value: string;
    required: boolean;
};

type VariableProperty = {
    label: string;
    type: 'type';
    value: 'const' | 'boolean' | 'string' | 'number';
    required: boolean;
};

export type Property = ConstProperty | VariableProperty;

export function buildJsonSchema(properties: Property[]): object {
    return {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'https://raw.githubusercontent.com/finos/architecture-as-code/main/calm/domains-example/security/schema/new-control.json',
        title: 'My New Control',
        type: 'object',
        allOf: [
            {
                $ref: 'https://raw.githubusercontent.com/finos/architecture-as-code/main/calm/draft/2024-08/meta/control-requirement.json',
            },
        ],
        properties: properties.reduce(
            (acc, { label, type, value }) => {
                acc[label] = {
                    [type]: value,
                };
                return acc;
            },
            {} as Record<string, object>
        ),
        required: [
            properties.filter((property) => property.required).map((property) => property.label),
        ],
    };
}
