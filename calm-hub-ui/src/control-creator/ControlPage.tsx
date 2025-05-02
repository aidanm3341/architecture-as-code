import { useState } from 'react';
import { ControlForm } from '../components/control-form/ControlForm.js';
import { Navbar } from '../components/navbar/Navbar.js';
import { buildJsonSchema, Property } from '../components/control-form/json-schema-builder.js';
import { JsonPreview } from '../components/json-preview/JsonPreview.js';

export function ControlPage() {
    const [data, setData] = useState<object>(buildJsonSchema([]));

    return (
        <div className="flex flex-col h-full">
            <Navbar />
            <div className="flex flex-1 flex-col items-center h-screen">
                <div className="flex flex-1 flex-row w-full p-10">
                    <div>
                        <br />
                        <h1 className="text-4xl font-bold">Control Creator</h1>
                        <br />

                        <ControlForm
                            onSubmit={() => {}}
                            onChange={(data) => {
                                setData(
                                    buildJsonSchema(
                                        data.map((item) => {
                                            if (item.variability === 'const') {
                                                const property: Property = {
                                                    label: item.label,
                                                    variability: 'const',
                                                    value: item.value,
                                                    valueType: item.valueType,
                                                    required: item.required,
                                                };

                                                return property;
                                            } else {
                                                const property: Property = {
                                                    label: item.label,
                                                    variability: 'variable',
                                                    value: item.value as
                                                        | 'string'
                                                        | 'number'
                                                        | 'boolean'
                                                        | 'const',
                                                    valueType: item.valueType,
                                                    required: item.required,
                                                };

                                                return property;
                                            }
                                        })
                                    )
                                );
                            }}
                        />
                    </div>

                    <div className="w-1/2 h-full">
                        <JsonPreview json={data} />
                    </div>
                </div>
            </div>
        </div>
    );
}
