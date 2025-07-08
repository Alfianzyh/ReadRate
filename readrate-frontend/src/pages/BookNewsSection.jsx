import React, { useEffect, useState } from "react";
import axios from "axios";

const BookNewsSection = () => {
  const [articles, setArticles] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/book-news",)
      .then((res) => setArticles(res.data))
      .catch((err) => console.error("Gagal ambil berita:", err));
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-[#2d1f16] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-yellow-100">
          Book News
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, visibleCount).map((a, idx) => (
            <a
              key={idx}
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white dark:bg-[#3a2a20] p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {a.thumbnail && (
                <div className="overflow-hidden rounded-md">
                  <img
                    src={a.thumbnail}
                    alt={a.title}
                    className="w-full h-40 object-cover rounded-md mb-3 transform group-hover:scale-105 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-yellow-100 group-hover:scale-[1.02] group-hover:tracking-tight transition-transform duration-300">
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

        {visibleCount < articles.length && (
          <div className="text-center mt-10">
            <button
              onClick={handleLoadMore}
              className="px-5 py-2 bg-orange-600 dark:bg-yellow-400 text-white dark:text-gray-900 font-semibold rounded-full hover:scale-105 transition duration-300"
            >
              Lihat Selengkapnya
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookNewsSection;
