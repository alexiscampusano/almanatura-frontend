import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { appRouter } from "@/routes/router";
import { useAccessibilityStore } from "@/stores/accessibility.store";

function FontSizeSync() {
  const fontSizeScale = useAccessibilityStore((state) => state.fontSizeScale);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizeScale * 100}%`;
  }, [fontSizeScale]);

  return null;
}

function App() {
  return (
    <>
      <FontSizeSync />
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
