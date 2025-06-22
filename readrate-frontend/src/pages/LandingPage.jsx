import React from 'react';
import PopularBooksSection from './PopularBooksSection';
import BookNewsSection from './BookNewsSection';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="text-4xl sm:text-5xl font-bold mb-4"
        >
          Selamat Datang di ReadRate 📚
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl mb-6"
        >
          Temukan, nilai, dan telusuri buku terbaik dari seluruh dunia.
        </motion.p>
        <motion.a 
          href="/register" 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow hover:shadow-lg transition"
        >
          Mulai Sekarang
        </motion.a>
      </section>

      {/* Buku Populer */}
      <PopularBooksSection />

      {/* Berita Buku */}
      <BookNewsSection />

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        &copy; {new Date().getFullYear()} ReadRate. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
