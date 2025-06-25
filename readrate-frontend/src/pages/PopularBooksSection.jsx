import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const keywords = [
  'booktok favorites',
  'must read novels',
  'top rated books',
  'popular fiction 2024',
  'award winning books',
  'bestselling romance novels',
  'most loved books',
  'critically acclaimed novels',
];

const PopularBooksSection = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      const tempBooks = [];

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

      const shuffled = tempBooks.sort(() => 0.5 - Math.random()).slice(0, 8);
      setBooks(shuffled);
    };

    fetchBooks();
  }, []);

  return (
    <section className="mt-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-yellow-100">
          Popular Books
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white dark:bg-[#2d1f16] rounded-xl shadow-md dark:shadow-sm hover:shadow-lg dark:hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {book.image ? (
                <div className="overflow-hidden rounded-t-xl bg-gray-100 dark:bg-[#3a2a20]">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-[140px] h-[210px] object-cover mx-auto transform group-hover:scale-105 transition duration-300 ease-in-out"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-[140px] h-[210px] bg-gray-300 dark:bg-[#3a2a20] flex items-center justify-center mx-auto rounded-t-xl text-sm text-gray-500 dark:text-gray-300">
                  No Image
                </div>
              )}
              <div className="mt-3 px-3 pb-4 text-center">
                <h3 className="font-medium text-sm text-gray-900 dark:text-yellow-100 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-yellow-300 mt-1">
                  {book.authors}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBooksSection;
