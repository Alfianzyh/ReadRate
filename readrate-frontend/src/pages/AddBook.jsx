import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
// NavBar dihilangkan sesuai permintaan (tidak perlu navbar di halaman ini)
import { motion } from 'framer-motion';
import { Search, Plus, Bookmark, Check } from 'lucide-react';

function AddBook() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    clearTimeout(debounceRef.current);

    if (!q || q.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchBooks(q);
    }, 450);
  };

  const searchBooks = async (q) => {
    setLoading(true);
    setStatusMsg('');
    try {
      const res = await axios.get(`http://localhost:8000/api/import-books`, {
        params: { q },
      });
      // Normalisasi response menjadi array:
      // - jika backend mengembalikan { data: [...] } atau [...] -> gunakan itu
      // - jika backend mengembalikan Google Books style { items: [...] } -> gunakan items
      // - jika tidak sesuai, fallback ke []
      const raw = res?.data ?? {};
      let items = [];
      if (Array.isArray(raw)) items = raw;
      else if (Array.isArray(raw.data)) items = raw.data;
      else if (Array.isArray(raw.items)) items = raw.items;
      else if (Array.isArray(raw.docs)) items = raw.docs;
      else items = [];
      setResults(items);
    } catch (err) {
      console.error('Gagal mencari buku', err);
      setStatusMsg('Gagal mencari buku. Cek koneksi atau server.');
    } finally {
      setLoading(false);
    }
  };

  const addToSelection = (book) => {
    if (selected.find((b) => b.id === book.id)) return;
    setSelected((s) => [book, ...s]);
  };

  const removeFromSelection = (bookId) => {
    setSelected((s) => s.filter((b) => b.id !== bookId));
  };

  const saveAllAsRead = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatusMsg('Silakan login terlebih dahulu.');
      return;
    }
    setStatusMsg('Menyimpan sebagai dibaca...');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      for (const book of selected) {
        await axios.post(`http://localhost:8000/api/books/${book.id}/mark-as-read`, {}, { headers });
      }
      setStatusMsg('Berhasil menyimpan semua sebagai dibaca.');
      setSelected([]);
    } catch (err) {
      console.error(err);
      setStatusMsg('Gagal menyimpan beberapa buku. Cek console.');
    }
  };

  const saveAllAsBookmark = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatusMsg('Silakan login terlebih dahulu.');
      return;
    }
    setStatusMsg('Menyimpan sebagai bookmark...');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      for (const book of selected) {
        await axios.post(`http://localhost:8000/api/books/${book.id}/bookmark`, {}, { headers });
      }
      setStatusMsg('Berhasil menyimpan semua sebagai bookmark.');
      setSelected([]);
    } catch (err) {
      console.error(err);
      setStatusMsg('Gagal menyimpan beberapa buku. Cek console.');
    }
  };

  return (
    <div className="bg-[#F3EEEA] dark:bg-[#5C4033] text-gray-900 dark:text-gray-100 min-h-screen">
      {/* <NavBar /> */}

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-4">Tambah Buku</h1>

        <div className="bg-[#fffaf6] dark:bg-[#3B2F2F] rounded-2xl shadow-sm p-4 mb-6">
          <label className="relative flex items-center">
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-300 mr-3" />
            <input
              value={query}
              onChange={handleSearchChange}
              placeholder="Cari judul, penulis, atau ISBN..."
              className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Hasil pencarian diambil dari Google Books melalui server.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="space-y-4">
              {loading && <div className="text-sm text-gray-600 dark:text-gray-300">Memuat hasil...</div>}
              {!loading && results.length === 0 && query && (
                <div className="text-sm text-gray-500 dark:text-gray-300">Tidak ada hasil.</div>
              )}

              {results.map((book) => (
                <motion.div
                  key={book.id ?? book.etag ?? `${book.volumeInfo?.title ?? 'b'}-${Math.random().toString(36).slice(2,8)}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#2f241f] p-3 rounded-xl flex gap-4 items-center"
                >
                  <img
                    src={
                      book.cover_url
                        ?? book.thumbnail
                        ?? book.imageLinks?.thumbnail
                        ?? book.volumeInfo?.imageLinks?.thumbnail
                        ?? '/no-cover.png'
                    }
                    alt={book.title ?? book.volumeInfo?.title ?? 'No title'}
                    className="w-20 h-28 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2">{book.title ?? book.volumeInfo?.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">✍️ {(book.author ?? book.volumeInfo?.authors)?.join ? (book.author ?? book.volumeInfo?.authors.join(', ')) : (book.author ?? book.volumeInfo?.authors ?? 'Unknown')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sumber: {book.source ?? book.publisher ?? book.volumeInfo?.publisher ?? '-'}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => addToSelection({
                        id: book.id ?? (book.volumeInfo?.industryIdentifiers?.[0]?.identifier ?? Math.random().toString(36).substr(2,9)),
                        title: book.title ?? book.volumeInfo?.title,
                        author: book.author ?? book.volumeInfo?.authors?.join(', '),
                        cover_url: book.cover_url ?? book.thumbnail ?? book.imageLinks?.thumbnail,
                      })}
                      className="bg-orange-700 hover:bg-orange-800 text-white rounded-full px-3 py-2 flex items-center gap-2 text-sm"
                      title="Tambah ke daftar"
                    >
                      <Plus size={14} /> Tambah
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <aside className="bg-white dark:bg-[#2f241f] p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold mb-3">Daftar untuk ditambahkan</h4>

            {selected.length === 0 && <div className="text-sm text-gray-500 dark:text-gray-300">Belum ada buku yang dipilih.</div>}

            <ul className="space-y-2 max-h-96 overflow-auto">
              {selected.map((b) => (
                <li key={b.id} className="flex items-center gap-3">
                  <img src={b.cover_url ?? '/no-cover.png'} alt={b.title} className="w-10 h-14 object-cover rounded-md" />
                  <div className="flex-1">
                    <div className="text-sm font-medium line-clamp-1">{b.title}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">{b.author}</div>
                  </div>
                  <button onClick={() => removeFromSelection(b.id)} className="text-sm text-gray-500 dark:text-gray-300">Hapus</button>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-col gap-2">
              <button onClick={saveAllAsRead} className="w-full bg-orange-700 hover:bg-orange-800 text-white rounded-full py-2 flex items-center justify-center gap-2">
                <Check size={16} /> Simpan sebagai Dibaca
              </button>
              <button onClick={saveAllAsBookmark} className="w-full bg-transparent border border-gray-200 dark:border-[#422c22] text-gray-800 dark:text-gray-100 rounded-full py-2 flex items-center justify-center gap-2">
                <Bookmark size={16} /> Simpan sebagai Bookmark
              </button>
            </div>

            {statusMsg && <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">{statusMsg}</div>}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default AddBook; // ✅ Ini WAJIB agar bisa di-import sebagai default
