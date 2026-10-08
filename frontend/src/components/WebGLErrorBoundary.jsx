// Shown in place of the liquid glass carousel when WebGL is unavailable.
import * as React from "react";
export class WebGLErrorBoundary extends React.Component {
    state = { hasError: false };
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        this.props.onError?.(error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? <WebGLFallback />;
        }
        return this.props.children;
    }
}
export function WebGLFallback({ className, message = "Interactive WebGL content is unavailable on this device/browser.", }) {
    return (<div className={["lgc-fallback", className].filter(Boolean).join(" ")} role="status" aria-live="polite">
      <p>{message}</p>
    </div>);
}
