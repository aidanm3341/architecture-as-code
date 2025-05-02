import { Editor } from '@monaco-editor/react';

export function JsonPreview({ json }: { json: object }) {
    return (
        <Editor
            width="100%"
            height="100%"
            defaultLanguage="json"
            value={JSON.stringify(json, null, 4)}
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
    );
}
