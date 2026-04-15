import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        expect(document.body).toBeTruthy();
    });

    it('renders the SonarFT logo link', () => {
        render(<App />);
        expect(screen.getByAltText('SonarFT')).toBeInTheDocument();
    });

    it('renders the Sign In button when user is not authenticated', () => {
        render(<App />);
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('renders the Crypto navigation link', () => {
        render(<App />);
        expect(screen.getByRole('link', { name: /crypto/i })).toBeInTheDocument();
    });
});
