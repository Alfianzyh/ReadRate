import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toggleDarkMode } from '../utils/theme';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate(); // ← penting!

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8000/api/read-books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const mappedBooks = res.data.data.map((item) => ({
          id: item.id,
          title: item.book?.title || "Judul tidak tersedia",
          author: item.book?.author || "Penulis tidak diketahui",
          cover_url: item.book?.cover_url || null,
          read_at: item.finished_at || "-",
          rating: item.book?.rating || 0,
        }));
        setBooks(mappedBooks);
      })
      .catch((err) => {
        console.error("Gagal fetch data buku: ", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 py-10 relative transition-colors">
      <h1 className="text-3xl font-bold mb-8 text-center">
        📚 Buku yang Sudah Dibaca
      </h1>

      {books.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Belum ada buku yang dibaca.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
              onClick={() => navigate(`/book/${book.id}`)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-5 flex flex-col cursor-pointer transform hover:scale-[1.015]"
            >
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-60 object-cover rounded-xl mb-4"
                />
              ) : (
                <div className="w-full h-60 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4 flex items-center justify-center text-gray-400 text-sm">
                  No Cover
                </div>
              )}

              <h2 className="text-lg font-semibold mb-1 line-clamp-2">
                {book.title}
              </h2>
              <p className="text-sm mb-1 text-gray-700 dark:text-gray-300">
                ✍️ {book.author}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                📅 {book.read_at}
              </p>

              {book.rating > 0 && (
                <div className="mt-2 text-yellow-400 text-sm">
                  {"★".repeat(book.rating)}{"☆".repeat(5 - book.rating)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Button */}
      <motion.button
        onClick={() => navigate("/add-book")}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50"
        aria-label="Tambah Buku"
      >
        <span className="text-2xl font-bold">+</span>
      </motion.button>

    </div>
  );
};

export default Dashboard;
