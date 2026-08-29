import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, ShieldAlert } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught React Error Boundary Exception:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleClearStorageAndReload = (): void => {
    try {
      localStorage.removeItem('culinary_copilot_saved_recipes');
      localStorage.removeItem('culinary_copilot_shopping_list');
      localStorage.removeItem('culinary_copilot_pantry_items');
      localStorage.removeItem('culinary_copilot_user_settings');
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          id="app-error-boundary-screen"
          className="min-h-screen bg-[#fcfaf7] text-[#2d2a26] flex items-center justify-center p-4 sm:p-6"
        >
          <div className="max-w-lg w-full bg-white rounded-3xl border border-[#e8e2d8] shadow-xl p-6 sm:p-8 text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#faf2ec] border border-[#f0ccb9] flex items-center justify-center text-[#d68c6a]">
              <ShieldAlert className="w-7 h-7 stroke-[1.8]" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#fdf3f0] text-[#9c391e] border border-[#f5cfc1]">
                Application Self-Healing Protection
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2a26]">
                Something interrupted the session
              </h1>
              <p className="text-xs sm:text-sm text-[#756e65] leading-relaxed">
                The application encountered an unexpected state error. Your data in memory has been guarded.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e8e2d8] text-left font-mono text-[11px] text-[#9c391e] overflow-x-auto max-h-32">
                {this.state.error.message || 'Unknown error'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#3d3a35] hover:bg-[#2b2925] text-white text-xs font-bold transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleClearStorageAndReload}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#faf2ec] hover:bg-[#f4e4da] text-[#8a4220] border border-[#f0ccb9] text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Local Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
