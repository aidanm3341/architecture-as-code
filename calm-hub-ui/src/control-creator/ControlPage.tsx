import { useState } from 'react';
import { ControlForm } from '../components/control-form/ControlForm.js';
import { Navbar } from '../components/navbar/Navbar.js';
import { buildJsonSchema, Property } from '../components/control-form/json-schema-builder.js';
import { Editor } from '@monaco-editor/react';

export function ControlPage() {
    const [data, setData] = useState<object>(buildJsonSchema([]));

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center h-screen">
                <div className="flex flex-row w-full p-10">
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
                                            if (item.valueType === 'const') {
                                                const property: Property = {
                                                    label: item.label,
                                                    type: 'const',
                                                    value: item.value,
                                                    required: item.required,
                                                };

                                                return property;
                                            } else {
                                                const property: Property = {
                                                    label: item.label,
                                                    type: 'type',
                                                    value: item.value as
                                                        | 'string'
                                                        | 'number'
                                                        | 'boolean'
                                                        | 'const',
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

                    <Editor
                        width="50%"
                        height="70vh"
                        defaultLanguage="json"
                        value={JSON.stringify(data, null, 4)}
                        options={{
                            readOnly: true,
                            minimap: {
                                enabled: false,
                            },
                            scrollBeyondLastLine: false,
                            showFoldingControls: 'always',
                            wordWrap: 'on',
                        }}
                    />
                </div>
            </div>
        </>
    );
}
