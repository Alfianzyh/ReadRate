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
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });

  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
      const token = response.data.token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Tampilkan popup sukses sebelum redirect
      setPopup({ show: true, type: 'success', message: 'Login berhasil! Mengarahkan...' });
      setTimeout(() => {
        setPopup({ show: false, type: '', message: '' });
        navigate('/dashboard');
      }, 1000); // sesuaikan durasi jika perlu
    } catch (error) {
      console.error('Login gagal:', error);
      setPopup({ show: true, type: 'error', message: 'Login gagal: periksa email/password' });
      setTimeout(() => {
        setPopup({ show: false, type: '', message: '' });
      }, 2000);
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-[#4a3a2d] text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-400 pr-10"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-yellow-200"
            disabled={isLoading}
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
          disabled={isLoading}
          className={`w-full py-2 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''} bg-orange-600 dark:bg-yellow-400 text-white dark:text-gray-900 font-semibold rounded-md hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-3`}
        >
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin text-white dark:text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span>Memproses...</span>
            </>
          ) : (
            'Login'
          )}
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

      {/* Popup notifikasi */}
      {popup.show && (
        <div className="fixed inset-0 flex items-end md:items-center justify-center pointer-events-none">
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto mb-8 md:mb-0 max-w-sm w-full mx-4 rounded-lg shadow-lg px-4 py-3 ${
              popup.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {popup.type === 'success' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1 text-sm">
                {popup.message}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Login;
