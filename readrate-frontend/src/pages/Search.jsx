import React from 'react';
import { useState } from "react";
import axios from "axios";

const Search = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [importing, setImporting] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setImporting(true);
      const res = await axios.get(`http://localhost:8000/api/import-books?q=${query}`);
      setBooks(res.data.data || []);
    } catch (err) {
      console.error("Gagal fetch buku:", err);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Cari Buku</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Masukkan judul buku..."
          className="border p-2 w-full rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={importing}
        >
          {importing ? "Memuat..." : "Cari"}
        </button>
      </form>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div key={book.id} className="bg-white p-4 rounded shadow">
              <img
                src={book.cover_url || "https://via.placeholder.com/150"}
                alt={book.title}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-sm text-gray-600">{book.authors}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Belum ada hasil pencarian.</p>
      )}
    </div>
  );
};

export default Search;
