import React from "react";      
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [readBooks, setReadBooks] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
  const token = localStorage.getItem('token');

  axios.get('http://localhost:8000/api/read-books', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => {
    setBooks(res.data);
  })
  .catch(err => {
    console.error('Gagal fetch data buku: ', err);
  });
}, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Buku yang Sudah Dibaca</h1>
      {readBooks.length === 0 ? (
        <p>Belum ada buku yang ditandai telah dibaca.</p>
      ) : (
        <ul className="space-y-4">
          {readBooks.map((item) => (
            <li key={item.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{item.book?.title}</h2>
              <p className="text-sm text-gray-600">Dibaca pada: {new Date(item.finished_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
