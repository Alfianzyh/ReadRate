import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Buku yang Telah Dibaca</h1>

      {books.length === 0 ? (
        <p className="text-gray-500">Belum ada buku yang dibaca.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-all">
              {book.cover_url && (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-60 object-cover rounded mb-3"
                />
              )}
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-sm text-gray-600 mb-1">Author: {book.author}</p>
              <p className="text-sm text-gray-500">Tanggal Dibaca: {book.read_at}</p>
              <div className="mt-2 text-yellow-500">
                {"★".repeat(book.rating)}{"☆".repeat(5 - book.rating)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
