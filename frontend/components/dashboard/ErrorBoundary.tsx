'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'
import { usePathname } from 'next/navigation'
import s from './ErrorBoundary.module.css'

interface ErrorBoundaryProps {
  children: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorContainerRef: HTMLDivElement | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Store errorInfo in state for display
    this.setState({ errorInfo })
    
    // Call optional error handler prop
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(_prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
    // Focus the error container when error occurs for accessibility
    if (!prevState.hasError && this.state.hasError && this.errorContainerRef) {
      this.errorContainerRef.focus()
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          ref={(el) => { this.errorContainerRef = el }}
          className={s.errorContainer}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          tabIndex={-1}
        >
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
                  <strong>Error:</strong> {this.state.error.toString()}
                  {'\n\n'}
                  <strong>Stack:</strong>
                  {'\n'}
                  {this.state.error.stack}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      {'\n\n'}
                      <strong>Component Stack:</strong>
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
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

// Wrapper component to reset error boundary on route change
export function ErrorBoundaryWithReset({ 
  children, 
  onError 
}: { 
  children: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}) {
  const pathname = usePathname()
  
  return (
    <ErrorBoundary key={pathname} onError={onError}>
      {children}
    </ErrorBoundary>
  )
}
