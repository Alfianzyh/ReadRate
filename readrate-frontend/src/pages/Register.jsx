import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/register', {
        name,
        email,
        password,
      });
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      alert('Gagal mendaftar. Periksa input.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5eee7] dark:bg-[#2d1f16] transition-colors duration-300 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white dark:bg-[#3a2a20] text-gray-800 dark:text-yellow-100 p-8 rounded-xl shadow-md w-full max-w-md space-y-5"
      >
        <h2 className="text-3xl font-bold text-center">Daftar Akun</h2>

        <input
          type="text"
          placeholder="Nama Lengkap"
          className="w-full px-4 py-2 bg-gray-100 dark:bg-[#4a3a2d] text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-400 transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 bg-gray-100 dark:bg-[#4a3a2d] text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-400 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 bg-gray-100 dark:bg-[#4a3a2d] text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-400 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-2 bg-orange-600 dark:bg-yellow-400 text-white dark:text-gray-900 font-semibold rounded-md hover:scale-105 transition-transform duration-300"
        >
          Daftar
        </button>
      </form>
    </div>
  );
};

export default Register;
