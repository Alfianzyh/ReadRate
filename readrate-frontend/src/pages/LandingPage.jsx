import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const LandingPage = () => {
  const [popularBooks, setPopularBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/books/popular").then(res => setPopularBooks(res.data.data));
    axios.get("http://localhost:8000/api/books/reviews").then(res => setReviews(res.data.data));
    axios.get("http://localhost:8000/api/books/news").then(res => setNews(res.data.data));
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-gradient-to-b from-blue-600 to-blue-800 text-white">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-4">
          Selamat datang di ReadRate 📚
        </motion.h1>
        <p className="text-lg max-w-xl mx-auto">Temukan dan beri ulasan buku favoritmu. Cek buku terpopuler & ulasan dari komunitas!</p>
      </section>

      {/* Buku Terpopuler */}
      <section className="py-12 px-4">
        <h2 className="text-2xl font-semibold mb-6">🔥 Buku Terpopuler</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {popularBooks.map((book, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-xl transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <img src={book.cover_url} alt={book.title} className="w-full h-48 object-cover rounded mb-3" />
              <h3 className="text-lg font-bold">{book.title}</h3>
              <p className="text-yellow-400 mt-1">★ {Number(book.average_rating).toFixed(1)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ulasan Pengguna */}
      <section className="py-12 px-4 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-2xl font-semibold mb-6">💬 Ulasan Terbaru</h2>
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-300">oleh {review.user_name} pada <strong>{review.book_title}</strong></p>
              <p className="mt-2">"{review.comment}"</p>
              <p className="mt-1 text-yellow-400">Rating: {'★'.repeat(review.rating)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Berita Buku */}
      <section className="py-12 px-4">
        <h2 className="text-2xl font-semibold mb-6">📰 Berita Buku</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.excerpt}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;