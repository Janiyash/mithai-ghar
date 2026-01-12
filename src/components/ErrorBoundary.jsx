import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🔥 App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="bg-white p-6 rounded-xl shadow text-center max-w-md">
            <h1 className="text-xl font-bold text-red-600 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              Open browser console to see the error.
            </p>
            <pre className="text-xs text-left bg-gray-100 p-2 rounded overflow-auto">
              {String(this.state.error)}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
