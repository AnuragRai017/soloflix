import React, { useState } from 'react';
import { Search, Menu, X, Film } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    if (searchQuery.trim()) {
      navigate('/');  // Navigate to home page to show search results
    }
  };

  return (
    <nav className="bg-black/95 backdrop-blur-sm fixed w-full z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Film className="w-8 h-8 text-red-600 group-hover:text-red-500 transition-colors" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              SoloFlix
            </h1>
          </Link>

          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies & shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900/50 text-white px-4 py-2 rounded-full pl-10 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </form>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-800">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies & shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900/50 text-white px-4 py-2 rounded-full pl-10 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;