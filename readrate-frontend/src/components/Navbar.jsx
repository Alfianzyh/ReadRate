import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, Menu, X, Search } from 'lucide-react';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  

  // Auto detect system theme
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleSearchChange = async (text) => {
    setQuery(text);
    if (text.length < 2) {
        setSuggestions([]);
        return;
    }

    try {
        const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${text}&maxResults=5`);
        const items = res.data.items || [];
        setSuggestions(items.map(item => ({
        title: item.volumeInfo.title,
        id: item.id,
        })));
    } catch (err) {
        console.error('Autocomplete error:', err);
    }
    };

    const handleSelectSuggestion = (item) => {
        setQuery('');
        setSuggestions([]);
        navigate(`/book/${item.id}`);
    };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-700 dark:text-yellow-400">
          ReadRate
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium ${
                    location.pathname === link.path
                    ? 'text-orange-700 dark:text-yellow-400'
                    : 'text-gray-700 dark:text-gray-200'
                } hover:text-orange-700 dark:hover:text-yellow-400 transition`}
                >
                {link.name}
            </Link>
          ))}

          {/* Search */}
            <div className="relative w-48">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Cari buku..."
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1 text-sm text-gray-800 dark:text-gray-100 focus:outline-none"
                />
                <button className="absolute right-2 top-1.5 text-gray-400">
                    <Search size={16} />
                </button>

                {/* Dropdown Suggestions */}
                {suggestions.length > 0 && (
                    <ul className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((item, idx) => (
                        <li
                        key={idx}
                        onClick={() => handleSelectSuggestion(item)}
                        className="px-3 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                        {item.title}
                        </li>
                    ))}
                    </ul>
                )}
            </div>
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="ml-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          aria-label="Toggle menu"
        >
          {mobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white dark:bg-gray-900 px-6 py-4 space-y-4"
        >
          {navLinks.map((link) => (
            <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenu(false)}
                className={`block text-base font-medium ${
                    location.pathname === link.path
                    ? 'text-orange-700 dark:text-yellow-400'
                    : 'text-gray-800 dark:text-gray-200'
                } hover:text-orange-700 dark:hover:text-yellow-400 transition`}
                >
                {link.name}
            </Link>

          ))}

          {/* Search for mobile */}
            <div className="relative w-48">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Cari buku..."
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1 text-sm text-gray-800 dark:text-gray-100 focus:outline-none"
                />
                <button className="absolute right-2 top-1.5 text-gray-400">
                    <Search size={16} />
                </button>

                {/* Dropdown Suggestions */}
                {suggestions.length > 0 && (
                    <ul className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((item, idx) => (
                        <li
                        key={idx}
                        onClick={() => handleSelectSuggestion(item)}
                        className="px-3 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                        {item.title}
                        </li>
                    ))}
                    </ul>
                )}
            </div>

          {/* Dark mode toggle mobile */}
          <button
            onClick={toggleDarkMode}
            className="mt-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </motion.nav>
      )}
    </header>
  );
};

export default Navbar;
