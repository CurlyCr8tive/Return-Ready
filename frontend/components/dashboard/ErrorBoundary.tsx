'use client'

import { Component, type ReactNode } from 'react'
import s from './ErrorBoundary.module.css'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // TODO: Send to error tracking service (e.g., Sentry)
    // logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={s.errorContainer}>
          <div className={s.errorCard}>
            <div className={s.iconWrapper}>
              <svg
                className={s.icon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            
            <h2 className={s.title}>Something went wrong</h2>
            
            <p className={s.message}>
              We encountered an unexpected error while loading your dashboard.
              This has been logged and we'll look into it.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={s.errorDetails}>
                <summary className={s.errorSummary}>Error details (dev only)</summary>
                <pre className={s.errorStack}>
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className={s.actions}>
              <button
                type="button"
                onClick={this.handleReset}
                className={s.retryButton}
              >
                Try again
              </button>
              
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className={s.homeButton}
              >
                Go to home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
