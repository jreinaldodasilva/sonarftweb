// App.js
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import CryptoTicker from "./components/CryptoTicker/CryptoTicker";
import { AuthProvider } from "./hooks/AuthProvider";
import "./App.css";
import "./styles.css";

// Layout components are always needed — static imports
// Page routes are lazy-loaded: each becomes a separate bundle chunk
const Home = lazy(() => import("./pages/Home/Home"));
const Crypto = lazy(() => import("./pages/Crypto/Crypto"));
const CryptoChatGPT = lazy(() => import("./pages/CryptoChatGPT/CryptoChatGPT"));
const Doggy = lazy(() => import("./pages/Doggy/Doggy"));

const PageLoader = () => (
    <div className="page-loader">
        Loading...
    </div>
);

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Header />
                    <CryptoTicker />
                    <main className="main-container">
                        <Suspense fallback={<PageLoader />}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/crypto" element={<Crypto />} />
                                <Route path="/cryptochatgpt" element={<CryptoChatGPT />} />
                                <Route path="/doggy" element={<Doggy />} />
                            </Routes>
                        </Suspense>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
