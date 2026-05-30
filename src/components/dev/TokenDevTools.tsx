import * as React from "react";

function parseSize(value: string) {
  if (!value) return "";
  return value.trim();
}

function setVar(name: string, v: string) {
  document.documentElement.style.setProperty(name, v);
}

export default function TokenDevTools() {
  const [buttonSize, setButtonSize] = React.useState(() =>
    parseSize(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--size-button-default",
      ) || "",
    ).replace(/"/g, ""),
  );
  const [inputSize, setInputSize] = React.useState(() =>
    parseSize(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--size-input-default",
      ) || "",
    ).replace(/"/g, ""),
  );
  const [avatarSize, setAvatarSize] = React.useState(() =>
    parseSize(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--size-avatar",
      ) || "",
    ).replace(/"/g, ""),
  );
  const [rootFs, setRootFs] = React.useState(
    () => getComputedStyle(document.documentElement).fontSize || "",
  );

  React.useEffect(() => {
    if (buttonSize) setVar("--size-button-default", buttonSize);
  }, [buttonSize]);
  React.useEffect(() => {
    if (inputSize) setVar("--size-input-default", inputSize);
  }, [inputSize]);
  React.useEffect(() => {
    if (avatarSize) setVar("--size-avatar", avatarSize);
  }, [avatarSize]);
  React.useEffect(() => {
    if (rootFs) document.documentElement.style.fontSize = rootFs;
  }, [rootFs]);

  const reset = () => {
    document.documentElement.style.removeProperty("--size-button-default");
    document.documentElement.style.removeProperty("--size-input-default");
    document.documentElement.style.removeProperty("--size-avatar");
    document.documentElement.style.fontSize = "";
    setButtonSize(
      parseSize(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--size-button-default",
        ) || "",
      ),
    );
    setInputSize(
      parseSize(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--size-input-default",
        ) || "",
      ),
    );
    setAvatarSize(
      parseSize(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--size-avatar",
        ) || "",
      ),
    );
    setRootFs(getComputedStyle(document.documentElement).fontSize || "");
  };

  return (
    <div className="fixed right-3 bottom-3 z-50 w-80 rounded-md border bg-card p-3 text-sm shadow-lg">
      <div className="flex items-center justify-between">
        <strong>Dev Tokens</strong>
        <button
          onClick={reset}
          className="text-xs text-muted-foreground underline"
        >
          Reset
        </button>
      </div>
      <div className="mt-2 space-y-2">
        <label className="flex flex-col">
          <span className="text-xs text-muted-foreground">Root font-size</span>
          <input
            value={rootFs}
            onChange={(e) => setRootFs(e.target.value)}
            className="mt-1 w-full rounded border px-2 py-1 text-sm"
            placeholder="e.g. 18px or 100%"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-xs text-muted-foreground">Button size</span>
          <input
            value={buttonSize}
            onChange={(e) => setButtonSize(e.target.value)}
            className="mt-1 w-full rounded border px-2 py-1 text-sm"
            placeholder="e.g. 2.75rem or 44px"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-xs text-muted-foreground">Input size</span>
          <input
            value={inputSize}
            onChange={(e) => setInputSize(e.target.value)}
            className="mt-1 w-full rounded border px-2 py-1 text-sm"
            placeholder="e.g. 2.75rem or 44px"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-xs text-muted-foreground">Avatar size</span>
          <input
            value={avatarSize}
            onChange={(e) => setAvatarSize(e.target.value)}
            className="mt-1 w-full rounded border px-2 py-1 text-sm"
            placeholder="e.g. 2.5rem or 40px"
          />
        </label>
      </div>
    </div>
  );
}
