export type Property = {
    label: string;
    variability: 'const' | 'variable';
    valueType: 'boolean' | 'string' | 'number' | 'object' | 'array';
    value: string;
    required: boolean;
};

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
            (acc, { label, variability, valueType, value }) => {
                if (variability === 'const') {
                    acc[label] = {
                        const: value,
                    };
                } else {
                    acc[label] = {
                        type: valueType,
                    };
                }
                return acc;
            },
            {} as Record<string, object>
        ),
        required: [
            properties.filter((property) => property.required).map((property) => property.label),
        ],
    };
}
