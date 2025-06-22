import React, { useEffect, useState } from "react";
import axios from "axios";

const BookNewsSection = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
  axios.get("http://localhost:8000/api/scrape-book-news")
    .then(res => setArticles(res.data))
    .catch(err => console.error("Gagal ambil berita:", err));
}, []);

  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">📰 Berita Dunia Buku</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a, idx) => (
          <a
            key={idx}
            href={a.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white dark:bg-gray-800 p-4 rounded-xl hover:shadow-lg transition-all"
          >
            {a.thumbnail && (
              <img
                src={a.thumbnail}
                alt={a.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
            )}
            <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">{a.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {a.description.slice(0, 100)}...
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400 block mt-2">
              {a.source} • {new Date(a.pubDate).toLocaleDateString()}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default BookNewsSection;
