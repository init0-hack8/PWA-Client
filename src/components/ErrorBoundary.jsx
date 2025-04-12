import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We're sorry, but something went wrong. Please try refreshing the page or contact support if the problem persists.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-mono text-sm">
                    {this.state.error?.toString()}
                  </p>
                  <details className="mt-2">
                    <summary className="cursor-pointer">Stack trace</summary>
                    <pre className="mt-2 text-xs overflow-auto">
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
                <Button variant="outline" onClick={() => this.setState({ hasError: false })}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 