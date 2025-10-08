import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import ReadHistory from './pages/ReadHistory';
import AddBook from './pages/AddBook';
import BookDetail from './pages/BookDetail';
import LandingPage from './pages/LandingPage';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f5eee7] dark:bg-[#2d1f16]">
      <AnimatePresence mode="wait" initial={location.pathname === '/'}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
          className="min-h-screen"
        >
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
            <Route path="/history" element={<ReadHistory />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/book/:id" element={<BookDetail />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;