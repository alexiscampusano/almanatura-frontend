import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { appRouter } from "@/routes/router";
import { useAccessibilityStore } from "@/stores/accessibility.store";

const queryClient = new QueryClient();

function FontSizeSync() {
  const fontSizeScale = useAccessibilityStore((state) => state.fontSizeScale);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizeScale * 100}%`;
  }, [fontSizeScale]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FontSizeSync />
      <RouterProvider router={appRouter} />
    </QueryClientProvider>
  );
}

export default App;
