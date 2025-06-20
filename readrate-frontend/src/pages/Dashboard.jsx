import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8000/api/read-books', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setBooks(response.data.data);
    })
    .catch(error => {
      console.error("Gagal fetch data buku: ", error);
    });
  }, []);

  return (
    <div>
      <h1>Buku yang sudah dibaca</h1>
      <ul>
        {books.map(book => (
          <li key={book.id}>{book.book.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
