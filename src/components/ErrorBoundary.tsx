import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  info: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Hogwarts ErrorBoundary]", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{ padding: 32, color: "#F2EAD8", background: "#0D1117", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
          <h1 style={{ fontSize: 24, color: "#D4AF37", marginBottom: 16 }}>Something went wrong</h1>
          <pre style={{ whiteSpace: "pre-wrap", color: "#C0C0C0", fontSize: 13, lineHeight: 1.6, background: "#161B22", padding: 16, borderRadius: 8, overflow: "auto" }}>
            {this.state.error?.message}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
