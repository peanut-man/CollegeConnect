import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-amber-50">
          <h1 className="m-0 mb-4 text-3xl font-bold">Something went wrong</h1>
          <p className="m-0 mb-6 text-slate-400">
            We're sorry, but something unexpected happened.
          </p>
          <button
            type="button"
            className="solid-button"
            onClick={this.handleRetry}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
