import * as React from "react";

export default function McpDevtools() {
  if (!import.meta.env.DEV) return null;

  const extensionUrl =
    "https://marketplace.visualstudio.com/items?itemName=GitHub.mcp-devtools";

  return (
    <div className="fixed left-3 bottom-3 z-50 w-80 rounded-md border bg-card p-3 text-sm shadow-lg">
      <div className="flex items-center justify-between">
        <strong>MCP DevTools</strong>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        To inspect the Model Context Protocol data, install the MCP DevTools
        extension or open the MCP webview. Follow instructions in the repository
        README.
      </p>
      <a
        className="mt-2 inline-block text-xs text-primary underline"
        href={extensionUrl}
        target="_blank"
        rel="noreferrer"
      >
        Open MCP DevTools extension page
      </a>
    </div>
  );
}
