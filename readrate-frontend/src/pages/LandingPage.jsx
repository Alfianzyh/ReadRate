import React from 'react';
import PopularBooksSection from './PopularBooksSection';
import BookNewsSection from './BookNewsSection';
import LandingPageButton from '../components/LandingPageButton';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center text-center md:text-left px-6 py-20 bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="z-10 max-w-xl md:mr-12 mb-10 md:mb-0">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Selamat Datang di <span className="text-blue-600">ReadRate</span> 📚
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

        {/* Ilustrasi Buku */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="z-10"
        >
          <img
            src="https://media.istockphoto.com/id/2187709387/photo/book-shelves-jam-packed.webp?a=1&b=1&s=612x612&w=0&k=20&c=znRNgUghwCYq0mXTNxXPT206TGu2aUrxeJZd7Qety0g="
            alt="Book reading illustration"
            className="w-[280px] md:w-[340px] rounded-2xl shadow-lg object-cover"
          />
        </motion.div>
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
