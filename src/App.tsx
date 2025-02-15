import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ShowDetails from './components/ShowDetails';
import MovieDetails from './components/MovieDetails';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { validateInput } from './utils/security';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    if (validateInput.isValidSearchQuery(query)) {
      setSearchQuery(query);
    }
  };

  return (
    <ErrorBoundary>
      <Router>
        <Navbar onSearch={handleSearch} />
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/show/:id" element={<ShowDetails />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;