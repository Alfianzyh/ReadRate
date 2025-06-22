import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const keywords = [
  'bestseller',
  'top fiction',
  'popular novel',
  'best books',
  'trending books',
  'most read novels',
  'award winning books',
];

const PopularBooksSection = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      const tempBooks = [];

      // Fetch dari Google Books
      try {
        const googleRes = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${randomKeyword}&maxResults=6`
        );
        const googleBooks = (googleRes.data.items || []).map(item => ({
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors?.join(', ') || 'Unknown',
          image:
            item.volumeInfo.imageLinks?.extraLarge ||
            item.volumeInfo.imageLinks?.large ||
            item.volumeInfo.imageLinks?.medium ||
            item.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') ||
            null,
        }));
        tempBooks.push(...googleBooks);
      } catch (err) {
        console.error('Gagal fetch dari Google Books:', err);
      }

      // Fetch dari NYT Books API
      try {
        const nytRes = await axios.get(
          'https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json',
          {
            params: {
              'api-key': 'Av7sSGUdqIo6hkzMRQwooTnTvktyWyyg',
            },
          }
        );

        const nytBooks = nytRes.data.results.books.map(book => ({
          id: book.primary_isbn13,
          title: book.title,
          authors: book.author,
          image: book.book_image || null,
        }));

        tempBooks.push(...nytBooks);
      } catch (err) {
        console.error('Gagal fetch dari NYT:', err);
      }

      // Acak dan ambil 6 buku
      const shuffled = tempBooks.sort(() => 0.5 - Math.random()).slice(0, 8);
      setBooks(shuffled);
    };

    fetchBooks();
  }, []);

  return (
    <section className="mt-14 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
          📈 Buku Populer Hari Ini
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-center">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition p-3 flex flex-col items-center"
            >
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-[140px] h-[210px] object-cover rounded-md mb-3 shadow"
                  loading="lazy"
                />
              ) : (
                <div className="w-[140px] h-[210px] bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded-md text-sm text-gray-500 mb-3">
                  No Image
                </div>
              )}
              <h3 className="font-medium text-sm text-center text-gray-900 dark:text-white line-clamp-2">
                {book.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">{book.authors}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBooksSection;
