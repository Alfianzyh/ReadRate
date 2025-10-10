import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Plus, Bookmark, Check } from 'lucide-react';

function AddBook() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [manualBook, setManualBook] = useState({ title: '', author: '', cover_url: '' });
  const debounceRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    clearTimeout(debounceRef.current);
    setStatusMsg('');

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
      const res = await axios.get('/api/import-books', { params: { q } });
      console.log('import-books response:', res.status, res.data);

      const raw = res?.data ?? {};
      let items = [];

      if (Array.isArray(raw)) items = raw;
      else if (Array.isArray(raw.data)) items = raw.data;
      else if (Array.isArray(raw.items)) items = raw.items;
      else if (Array.isArray(raw.docs)) items = raw.docs;
      else {
        const found = Object.values(raw).find((v) => Array.isArray(v));
        if (Array.isArray(found)) items = found;
      }

      const normalized = items.map((it) => {
        if (it?.volumeInfo) {
          return {
            id: it.id ?? it.etag ?? JSON.stringify(it.volumeInfo?.title).slice(0, 12),
            title: it.volumeInfo?.title ?? 'Unknown title',
            author: (it.volumeInfo?.authors || []).join(', '),
            cover_url: it.volumeInfo?.imageLinks?.thumbnail ?? it.volumeInfo?.imageLinks?.smallThumbnail ?? null,
            raw: it,
          };
        }
        return {
          id: it.id ?? it._id ?? Math.random().toString(36).slice(2, 9),
          title: it.title ?? it.name ?? 'Unknown title',
          author: it.author ?? it.authors ?? '',
          cover_url: it.cover_url ?? it.thumbnail ?? null,
          raw: it,
        };
      });

      setResults(normalized);
      if (!normalized.length) setStatusMsg('Tidak ada hasil pencarian dari server.');
    } catch (err) {
      console.error('Gagal mencari buku:', err);
      const serverMsg = err?.response?.data?.message ?? err?.response?.data ?? err.message;
      setStatusMsg(`Gagal mencari buku. ${serverMsg}`);
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

  const handleManualAdd = () => {
    if (!manualBook.title.trim()) {
      setStatusMsg('Judul buku wajib diisi.');
      return;
    }

    const newBook = {
      id: Math.random().toString(36).substr(2, 9),
      title: manualBook.title,
      author: manualBook.author || 'Unknown',
      cover_url: manualBook.cover_url || '/no-cover.png',
    };

    addToSelection(newBook);
    setManualBook({ title: '', author: '', cover_url: '' });
    setStatusMsg('Buku manual berhasil ditambahkan.');
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
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-4">Tambah Buku</h1>

        {/* Input Search */}
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
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Hasil pencarian diambil dari Google Books melalui server.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hasil Pencarian */}
          <div className="col-span-2">
            <div className="space-y-4">
              {loading && <div className="text-sm text-gray-600 dark:text-gray-300">Memuat hasil...</div>}
              {!loading && query && results.length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-300">{statusMsg || 'Tidak ada hasil pencarian.'}</div>
              )}

              {results.map((book) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#2f241f] p-3 rounded-xl flex gap-4 items-center"
                >
                  <img
                    src={book.cover_url ?? '/no-cover.png'}
                    alt={book.title ?? 'No title'}
                    className="w-20 h-28 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">✍️ {book.author || 'Unknown'}</p>
                  </div>
                  <button
                    onClick={() => addToSelection(book)}
                    className="bg-orange-700 hover:bg-orange-800 text-white rounded-full px-3 py-2 flex items-center gap-2 text-sm"
                  >
                    <Plus size={14} /> Tambah
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="bg-white dark:bg-[#2f241f] p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold mb-3">Daftar untuk ditambahkan</h4>

            {/* Form Tambah Manual */}
            <div className="border-b border-gray-300 dark:border-gray-700 pb-3 mb-3">
              <p className="text-sm mb-2">Tambah buku manual:</p>
              <input
                type="text"
                placeholder="Judul buku"
                value={manualBook.title}
                onChange={(e) => setManualBook({ ...manualBook, title: e.target.value })}
                className="w-full mb-2 px-2 py-1 rounded-md text-sm bg-gray-100 dark:bg-[#3b2f2f] outline-none"
              />
              <input
                type="text"
                placeholder="Nama penulis (opsional)"
                value={manualBook.author}
                onChange={(e) => setManualBook({ ...manualBook, author: e.target.value })}
                className="w-full mb-2 px-2 py-1 rounded-md text-sm bg-gray-100 dark:bg-[#3b2f2f] outline-none"
              />
              <input
                type="text"
                placeholder="URL cover (opsional)"
                value={manualBook.cover_url}
                onChange={(e) => setManualBook({ ...manualBook, cover_url: e.target.value })}
                className="w-full mb-2 px-2 py-1 rounded-md text-sm bg-gray-100 dark:bg-[#3b2f2f] outline-none"
              />
              <button
                onClick={handleManualAdd}
                className="w-full bg-orange-700 hover:bg-orange-800 text-white rounded-full py-1.5 flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={14} /> Tambah Buku Manual
              </button>
            </div>

            {selected.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-300">
                Belum ada buku yang dipilih.
              </div>
            ) : (
              <ul className="space-y-2 max-h-96 overflow-auto">
                {selected.map((b) => (
                  <li key={b.id} className="flex items-center gap-3">
                    <img
                      src={b.cover_url ?? '/no-cover.png'}
                      alt={b.title}
                      className="w-10 h-14 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium line-clamp-1">{b.title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">{b.author}</div>
                    </div>
                    <button
                      onClick={() => removeFromSelection(b.id)}
                      className="text-sm text-gray-500 dark:text-gray-300 hover:underline"
                    >
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={saveAllAsRead}
                className="w-full bg-orange-700 hover:bg-orange-800 text-white rounded-full py-2 flex items-center justify-center gap-2"
              >
                <Check size={16} /> Simpan sebagai Dibaca
              </button>
              <button
                onClick={saveAllAsBookmark}
                className="w-full bg-transparent border border-gray-200 dark:border-[#422c22] text-gray-800 dark:text-gray-100 rounded-full py-2 flex items-center justify-center gap-2"
              >
                <Bookmark size={16} /> Simpan sebagai Bookmark
              </button>
            </div>

            {statusMsg && (
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">{statusMsg}</div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default AddBook;
