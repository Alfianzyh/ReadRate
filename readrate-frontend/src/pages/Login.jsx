import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      console.error('Login gagal:', error);
      alert('Email atau password salah!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5eee7] dark:bg-[#2d1f16] transition-colors duration-300 px-4">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white dark:bg-[#3a2a20] text-gray-800 dark:text-yellow-100 p-8 rounded-xl shadow-md w-full max-w-md space-y-5"
      >

        <h2 className="text-3xl font-bold text-center">Login</h2>
        <input
          type="email"
          className="w-full px-4 py-2 bg-gray-100 dark:bg-[#4a3a2d] text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-400 transition"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-[#4a3a2d] text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-400 pr-10"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-yellow-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="text-right text-sm">
          <a
            href="/forgot-password"
            className="text-orange-600 dark:text-yellow-300 hover:underline"
          >
            Lupa password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-orange-600 dark:bg-yellow-400 text-white dark:text-gray-900 font-semibold rounded-md hover:scale-105 transition-transform duration-300"
        >
          Login
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-yellow-300">
          Belum punya akun?{' '}
          <a
            href="/register"
            className="text-orange-700 dark:text-yellow-400 underline"
          >
            Daftar di sini
          </a>
        </p>
      </motion.form>
    </div>
  );
}

export default Login;
