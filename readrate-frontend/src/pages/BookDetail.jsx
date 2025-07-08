import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/books/${id}`)
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil detail buku:", err);
        setError("Buku tidak ditemukan atau terjadi kesalahan.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-white dark:bg-gray-900 min-h-screen">
        <p className="text-lg">Memuat data buku...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-white dark:bg-gray-900 min-h-screen">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
      {book.cover && (
        <img
          src={book.cover}
          alt={book.title}
          className="w-64 h-auto rounded-lg mb-6"
        />
      )}
      <p className="text-lg mb-2">
        <span className="font-semibold">Penulis:</span> {book.author}
      </p>
      <p className="text-lg mb-2">
        <span className="font-semibold">Tahun Terbit:</span> {book.year}
      </p>
      <p className="text-base mt-4 text-gray-300">{book.description}</p>
    </div>
  );
}

export default BookDetail;
