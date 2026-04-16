import { Component } from "react";
import PropTypes from "prop-types";
import "./errorboundary.css";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-boundary__box">
                        <h2>Something went wrong</h2>
                        <p>An unexpected error occurred in the trading interface.</p>
                        {process.env.NODE_ENV === "development" && (
                            <pre className="error-boundary__detail">
                                {this.state.error?.message}
                            </pre>
                        )}
                        <button onClick={this.handleReload}>
                            Try again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
