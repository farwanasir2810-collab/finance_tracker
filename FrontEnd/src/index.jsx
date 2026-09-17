import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import './styles/app.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Finora App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-6 font-sans">
          <div className="max-w-xl w-full p-8 rounded-3xl bg-white border border-pink-200 shadow-xl text-center space-y-4">
            <span className="text-4xl block">🌸</span>
            <h2 className="text-2xl font-black text-slate-900">Finora Pro - Error Debug Diagnostic</h2>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-left overflow-auto max-h-60 text-xs font-mono text-rose-700">
              <strong className="block mb-2 text-rose-900 font-sans">Error Traceback Details:</strong>
              {this.state.error && this.state.error.toString()}
              <br />
              <span className="text-[10px] text-rose-500 opacity-80 mt-2 block whitespace-pre-wrap">
                {this.state.error && this.state.error.stack}
              </span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-sm rounded-2xl shadow-md border-0 hover:scale-105 transition-all"
            >
              Reload Application ✨
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
