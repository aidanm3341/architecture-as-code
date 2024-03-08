import * as vscode from 'vscode';
import { convert } from './CalmToMermaid';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('calm.visualize', () => {
            const panel = vscode.window.createWebviewPanel(
                'calmVisualizer',
                'CALM Visualizer',
                vscode.ViewColumn.Two, // so it doesn't hide the currently opened file
                {}
            );

            panel.webview.options = {
                enableScripts: true // required for the mermaid script to work
            };

            const currentFile = vscode.window.activeTextEditor?.document.getText() || '';
            const mermaid = convert(currentFile);
            panel.webview.html = getWebviewContent(mermaid);
        })
    );
};

function getWebviewContent(mermaid: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CALM Visualizer</title>

    <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        mermaid.initialize({ 
            startOnLoad: true
        });
    </script>
</head>

<body style="background-color: white">
    <pre class="mermaid">
        ${mermaid}
    </pre>
</body>
</html>`;
};