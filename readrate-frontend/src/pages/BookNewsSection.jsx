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
    <section className="py-16 px-6 bg-gray-50 dark:bg-[#2d1f16] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-yellow-100">
          Books News
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a, idx) => (
            <a
              key={idx}
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white dark:bg-[#3a2a20] p-4 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-lg transition-all duration-300"
            >
              {a.thumbnail && (
                <img
                  src={a.thumbnail}
                  alt={a.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                  loading="lazy"
                />
              )}
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-yellow-100">
                {a.title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-yellow-300">
                {a.description.slice(0, 100)}...
              </p>
              <span className="text-xs text-gray-500 dark:text-yellow-400 block mt-3">
                {a.source} • {new Date(a.pubDate).toLocaleDateString()}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookNewsSection;
