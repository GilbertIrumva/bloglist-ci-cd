import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true }
  }

  componentDidCatch(_error, _errorInfo) {
    // eslint-disable-next-line no-console
    console.error(_error, _errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <p>An unexpected error occurred while rendering the application.</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
