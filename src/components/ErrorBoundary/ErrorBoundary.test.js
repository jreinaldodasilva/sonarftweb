import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

// Component that throws on render when shouldThrow is true
const ThrowingComponent = ({ shouldThrow }) => {
    if (shouldThrow) throw new Error("Test render error");
    return <div>Normal content</div>;
};

// Suppress React's error boundary console.error output in tests
beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
    console.error.mockRestore();
});

describe("ErrorBoundary", () => {
    it("renders children when no error occurs", () => {
        render(
            <ErrorBoundary>
                <div>Safe content</div>
            </ErrorBoundary>
        );
        expect(screen.getByText("Safe content")).toBeInTheDocument();
    });

    it("renders fallback UI when a child throws", () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    });

    it("does not show children when in error state", () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.queryByText("Normal content")).not.toBeInTheDocument();
    });

    it("resets error state when Try again is clicked", () => {
        const { rerender } = render(
            <ErrorBoundary>
                <ThrowingComponent shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /try again/i }));

        // Re-render with non-throwing component after reset
        rerender(
            <ErrorBoundary>
                <ThrowingComponent shouldThrow={false} />
            </ErrorBoundary>
        );
        expect(screen.getByText("Normal content")).toBeInTheDocument();
    });
});
