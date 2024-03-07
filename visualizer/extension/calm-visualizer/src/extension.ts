import * as vscode from 'vscode';
import { convert } from './CalmToMermaid';

export function activate(context: vscode.ExtensionContext) {
    
    context.subscriptions.push(
        vscode.commands.registerCommand('calm.visualize', () => {
            // Create and show panel
            const panel = vscode.window.createWebviewPanel(
                'calmVisualizer',
                'CALM Visualizer',
                vscode.ViewColumn.One,
                {}
            );

            // And set its HTML content
            panel.webview.options = {
                enableScripts: true
            };

            const currentFile = vscode.window.activeTextEditor?.document.getText() || '';
            const mermaid = convert(currentFile);
            panel.webview.html = getWebviewContent(mermaid);
        })
    );
}

function getWebviewContent(mermaid: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>

    <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        mermaid.initialize({ startOnLoad: true });
    </script>
</head>

<body>
    <pre class="mermaid">
        ${mermaid}
    </pre>
</body>
</html>`;
}