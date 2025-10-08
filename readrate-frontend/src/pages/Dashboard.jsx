import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

const Dashboard = () => {
  const [readBooks, setReadBooks] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [ratedBooks, setRatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("read"); // 'read' | 'bookmarks' | 'rated'
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const headers = { Authorization: `Bearer ${token}` };

    const reqs = [
      axios.get("http://localhost:8000/api/read-books", { headers }),
      axios.get("http://localhost:8000/api/bookmarks", { headers }),
      axios.get("http://localhost:8000/api/ratings", { headers }),
    ];

    Promise.all(reqs)
      .then(([readRes, bookmarksRes, ratingsRes]) => {
        const mapRead = (items) =>
          items?.data?.data?.map((item) => ({
            id: item.id,
            title: item.book?.title || "Judul tidak tersedia",
            author: item.book?.author || "Penulis tidak diketahui",
            cover_url: item.book?.cover_url || null,
            read_at: item.finished_at || item.read_at || "-",
            rating: item.rating ?? item.book?.rating ?? 0,
            note: item.note ?? null,
          })) || [];

        const mapBookmark = (items) =>
          items?.data?.data?.map((item) => {
            const book = item.book || item;
            return {
              id: book.id,
              title: book.title || "Judul tidak tersedia",
              author: book.author || "Penulis tidak diketahui",
              cover_url: book.cover_url || null,
              read_at: "-",
              rating: book.rating ?? 0,
            };
          }) || [];

        const mapRatings = (items) =>
          items?.data?.data?.map((item) => {
            const book = item.book || item;
            return {
              id: book.id,
              title: book.title || "Judul tidak tersedia",
              author: book.author || "Penulis tidak diketahui",
              cover_url: book.cover_url || null,
              read_at: item.finished_at || item.read_at || "-",
              rating: item.rating ?? book.rating ?? 0,
              note: item.note ?? null,
            };
          }) || [];

        setReadBooks(mapRead(readRes));
        setBookmarks(mapBookmark(bookmarksRes));
        setRatedBooks(mapRatings(ratingsRes));
      })
      .catch((err) => {
        console.error("Gagal fetch data dashboard: ", err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // sync theme with navbar behavior
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDark(useDark);
    document.documentElement.classList.toggle("dark", useDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  const renderGrid = (books) => {
    if (!books || books.length === 0) {
      return (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Kosong.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <motion.div
            key={book.id ?? index}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.04 }}
            onClick={() => navigate(`/book/${book.id}`)}
            className="bg-[#fffaf6] dark:bg-[#3B2F2F] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 flex flex-col cursor-pointer transform hover:scale-[1.012]"
          >
            {book.cover_url ? (
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-xl mb-4 flex items-center justify-center text-gray-400">
                No Cover
              </div>
            )}

            <h2 className="text-md font-semibold mb-1 line-clamp-2">
              {book.title}
            </h2>
            <p className="text-sm mb-1 text-gray-700 dark:text-gray-300">
              ✍️ {book.author}
            </p>

            <div className="mt-auto flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                📅 {book.read_at}
              </div>
              <div className="text-sm text-yellow-400">
                {book.rating > 0 ? (
                  <span>
                    {"★".repeat(book.rating)}{"☆".repeat(5 - book.rating)}
                  </span>
                ) : (
                  <span className="text-gray-400">Belum rating</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const activeCount = () => {
    if (activeTab === "read") return readBooks.length;
    if (activeTab === "bookmarks") return bookmarks.length;
    return ratedBooks.length;
  };

  return (
    <div className="bg-[#F3EEEA] dark:bg-[#5C4033] text-gray-900 dark:text-gray-100">
      <div className="min-h-screen px-6 py-10 relative transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">
              📚 Dashboard Buku
              <span className="text-sm font-medium text-gray-500 dark:text-gray-300 ml-3">
                ({activeCount()})
              </span>
            </h1>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="ml-2 p-2 rounded-full hover:bg-white/30 dark:hover:bg-white/10 transition"
                aria-label="Ganti tema"
                title="Ganti tema"
              >
                {isDark ? (
                  <Sun size={18} className="text-white" />
                ) : (
                  <Moon size={18} className="text-gray-700" />
                )}
              </button>
              <button
                onClick={() => navigate("/add-book")}
                className="bg-orange-700 hover:bg-orange-800 text-white rounded-full px-4 py-2 text-sm shadow"
              >
                Tambah Buku
              </button>
            </div>
          </div>

          <div className="bg-[#fffaf6] dark:bg-[#3B2F2F] rounded-2xl shadow-sm p-3 mb-6">
            <nav className="flex gap-2">
              <button
                onClick={() => setActiveTab("read")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "read" ? 'bg-orange-700 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Dibaca
              </button>
              <button
                onClick={() => setActiveTab("bookmarks")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "bookmarks" ? 'bg-orange-700 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Bookmark
              </button>
              <button
                onClick={() => setActiveTab("rated")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "rated" ? 'bg-orange-700 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Dirating
              </button>
            </nav>
          </div>

          <div className="mb-20">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-white">Memuat...</div>
            ) : (
              <>
                {activeTab === "read" && renderGrid(readBooks)}
                {activeTab === "bookmarks" && renderGrid(bookmarks)}
                {activeTab === "rated" && renderGrid(ratedBooks)}
              </>
            )}
          </div>
        </div>

        <motion.button
          onClick={() => navigate("/add-book")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 bg-orange-700 hover:bg-orange-800 text-white rounded-full p-3 shadow-lg z-50"
          aria-label="Tambah Buku"
        >
          <span className="text-lg font-bold">+</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Dashboard;
