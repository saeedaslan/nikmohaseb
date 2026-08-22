"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-md border border-red-200 bg-red-50 p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h2 className="text-lg font-semibold text-red-700">
            خطایی رخ داده است
          </h2>
          <p className="max-w-md text-sm text-red-600">
            متأسفانه مشکلی در نمایش این بخش پیش آمده است. لطفاً صفحه را مجدداً بارگذاری کنید.
          </p>
          {this.state.error && process.env.NODE_ENV === "development" && (
            <pre className="mt-2 max-w-lg overflow-auto rounded bg-red-100 p-3 text-xs text-red-800">
              {this.state.error.message}
            </pre>
          )}
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => this.setState({ hasError: false, error: undefined })}
            >
              <RefreshCw className="h-4 w-4" />
              تلاش مجدد
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              بازگشت به خانه
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
