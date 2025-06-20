import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8000/api/read-books", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      // Ambil hanya data buku dari respon
      const mappedBooks = res.data.data.map(item => ({
        id: item.id,
        title: item.book?.title || "Judul tidak tersedia",
        author: item.book?.author || "Penulis tidak diketahui",
        cover_url: item.book?.cover_url || null,
        read_at: item.finished_at || "-",
        rating: item.book?.rating || 0,
      }));
      setBooks(mappedBooks);
    })
    .catch(err => {
      console.error("Gagal fetch data buku: ", err);
    });
  }, []);

 return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">📚 Buku yang Sudah Dibaca</h1>

      {books.length === 0 ? (
        <p className="text-gray-500 text-center">Belum ada buku yang dibaca.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col"
            >
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-60 object-cover rounded-xl mb-4"
                />
              ) : (
                <div className="w-full h-60 bg-gray-200 rounded-xl mb-4 flex items-center justify-center text-gray-400 text-sm">
                  No Cover
                </div>
              )}

              <h2 className="text-lg font-bold text-gray-800 mb-1">{book.title}</h2>
              <p className="text-sm text-gray-600 mb-1">✍️ {book.author || 'Author tidak diketahui'}</p>
              <p className="text-sm text-gray-500">📅 {book.read_at || 'Belum dicatat'}</p>
              {book.rating && (
                <div className="mt-2 text-yellow-400 text-lg">
                  {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
