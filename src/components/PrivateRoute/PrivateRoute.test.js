import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

const renderWithRouter = (ui, { initialEntries = ["/"] } = {}) =>
    render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);

describe("PrivateRoute", () => {
    it("renders children when value is truthy", () => {
        renderWithRouter(
            <PrivateRoute value={{ id: "user_123" }}>
                <div>Protected Content</div>
            </PrivateRoute>
        );
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("redirects to / when value is null", () => {
        renderWithRouter(
            <PrivateRoute value={null}>
                <div>Protected Content</div>
            </PrivateRoute>
        );
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    it("redirects to / when value is undefined", () => {
        renderWithRouter(
            <PrivateRoute value={undefined}>
                <div>Protected Content</div>
            </PrivateRoute>
        );
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });
});
