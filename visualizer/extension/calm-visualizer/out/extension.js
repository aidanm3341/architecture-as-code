"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const CalmToMermaid_1 = require("./CalmToMermaid");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('calm.visualize', () => {
        // Create and show panel
        const panel = vscode.window.createWebviewPanel('calmVisualizer', 'CALM Visualizer', vscode.ViewColumn.One, {});
        // And set its HTML content
        panel.webview.options = {
            enableScripts: true
        };
        const currentFile = vscode.window.activeTextEditor?.document.getText() || '';
        const mermaid = (0, CalmToMermaid_1.convert)(currentFile);
        panel.webview.html = getWebviewContent(mermaid);
    }));
}
exports.activate = activate;
function getWebviewContent(mermaid) {
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
//# sourceMappingURL=extension.js.map