import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './ui/Button';

/**
 * Error Boundary component to catch and gracefully handle errors
 * Prevents entire app from crashing on component error
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null,
            errorInfo: null,
            errorCount: 0
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState(prev => ({
            error,
            errorInfo,
            errorCount: prev.errorCount + 1
        }));
    }

    handleReset = () => {
        this.setState({ 
            hasError: false, 
            error: null,
            errorInfo: null
        });
    };

    handleReload = () => {
        window.location.reload();
    };

    handleHome = () => {
        window.location.href = '/dashboard';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full">
                        <div className="bg-[#161b22] border border-red-500/20 rounded-lg p-8 space-y-6">
                            {/* Header */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-red-500/10 rounded-lg">
                                    <AlertTriangle className="text-red-400" size={32} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
                                    <p className="text-slate-400">PyQuest encountered an error and crashed this component.</p>
                                </div>
                            </div>

                            {/* Error Details */}
                            <div className="bg-black/30 rounded p-4 space-y-2">
                                <p className="text-xs font-mono text-red-400 font-bold">ERROR</p>
                                <p className="text-sm text-slate-300 font-mono break-words">
                                    {this.state.error?.message || 'Unknown error'}
                                </p>
                                {import.meta.env.DEV && this.state.errorInfo && (
                                    <details className="mt-2 text-xs text-slate-500">
                                        <summary className="cursor-pointer hover:text-slate-400">Stack trace</summary>
                                        <pre className="mt-2 overflow-auto max-h-48 bg-black/50 p-2 rounded text-red-400">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>

                            {/* Error Count Warning */}
                            {this.state.errorCount >= 3 && (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-4">
                                    <p className="text-sm text-yellow-400">
                                        ⚠️ Multiple errors detected. Your browser session may be corrupted. 
                                        Consider reloading the page.
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 sm:flex-row flex-col-reverse">
                                <Button
                                    onClick={this.handleReset}
                                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border-none"
                                >
                                    <RefreshCw size={16} className="mr-2" />
                                    Try again
                                </Button>
                                <Button
                                    onClick={this.handleHome}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white border-none"
                                >
                                    <Home size={16} className="mr-2" />
                                    Go home
                                </Button>
                                {this.state.errorCount >= 3 && (
                                    <Button
                                        onClick={this.handleReload}
                                        className="flex-1 bg-red-600 hover:bg-red-500 text-white border-none"
                                    >
                                        <RefreshCw size={16} className="mr-2" />
                                        Reload page
                                    </Button>
                                )}
                            </div>

                            {/* Support Info */}
                            <p className="text-xs text-slate-500 text-center">
                                If this problem persists, check your browser console for more details.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
