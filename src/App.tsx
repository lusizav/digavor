import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BulkSniper from './pages/BulkSniper';
import CreativeMixer from './pages/CreativeMixer';
import SavedDomains from './pages/SavedDomains';

function App() {
    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/bulk" element={<BulkSniper />} />
                        <Route path="/mixer" element={<CreativeMixer />} />
                        <Route path="/saved" element={<SavedDomains />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
