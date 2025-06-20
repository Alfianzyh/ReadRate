import React from 'react';
import { useParams } from 'react-router-dom';

function BookDetail() {
  const { id } = useParams();

  return (
    <div className="p-6 text-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold">Detail Buku (ID: {id})</h1>
      {/* Bisa fetch detail buku berdasarkan id di sini */}
    </div>
  );
}

export default BookDetail;
