import React from 'react';
import PopularBooksSection from './PopularBooksSection';
import BookNewsSection from './BookNewsSection';
import LandingPageButton from '../components/LandingPageButton';
import NavBar from '../components/NavBar';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <NavBar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center text-center md:text-left px-6 py-20 bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] dark:from-[#3B2F2F] dark:to-[#2E1D1D] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg"
          alt="Background Bookshelf"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-transparent dark:from-[#3B2F2F]/80 dark:via-[#3B2F2F]/40 dark:to-transparent" />
      </div>


        {/* Text & CTA */}
        <div className="z-10 max-w-xl md:mr-12 mb-10 md:mb-0">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 3, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Welcome to <span className="text-orange-700 dark:text-yellow-400">ReadRate</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-6"
          >
            Temukan, nilai, dan telusuri buku terbaik dari seluruh dunia bersama komunitas pembaca.
          </motion.p>
          <LandingPageButton />
        </div>
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
