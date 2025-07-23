import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-3xl font-bold text-red-600">Something went wrong.</h1>
          <p className="text-gray-600 mt-4">{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <a href="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700">
            Return to Home
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;