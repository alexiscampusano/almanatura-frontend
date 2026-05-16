import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <Card className="mx-auto my-8 max-w-md border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Algo salió mal</CardTitle>
            <CardDescription>
              Ha ocurrido un error inesperado. Puedes intentar de nuevo o
              recargar la página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {this.state.error && (
              <pre className="max-h-32 overflow-auto rounded bg-muted p-3 text-xs text-muted-foreground">
                {this.state.error.message}
              </pre>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={this.handleReset} variant="outline">
              Intentar de nuevo
            </Button>
            <Button onClick={() => window.location.reload()}>
              Recargar página
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}
