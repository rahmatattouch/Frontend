import { Component } from "react";

/**
 * Catches JavaScript errors anywhere in the component tree and
 * renders a friendly fallback UI instead of a blank page.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white border border-red-200 rounded-xl p-8 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-xl font-bold">!</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 mb-2">
              Une erreur est survenue
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              {this.state.error?.message ?? "Erreur inattendue. Veuillez recharger la page."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
