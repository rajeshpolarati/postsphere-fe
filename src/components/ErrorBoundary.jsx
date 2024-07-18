import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error :", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      <div>An Error Has Occurred</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
