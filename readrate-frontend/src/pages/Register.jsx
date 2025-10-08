import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });

  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push('Minimal 8 karakter');
    if (!/[A-Z]/.test(pwd)) errors.push('Minimal 1 huruf kapital (A-Z)');
    if (!/[a-z]/.test(pwd)) errors.push('Minimal 1 huruf kecil (a-z)');
    if (!/[0-9]/.test(pwd)) errors.push('Minimal 1 angka (0-9)');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push('Minimal 1 karakter spesial');
    return errors;
  };

  React.useEffect(() => {
    const errs = validatePassword(password);
    setPasswordErrors(errs);
    setIsPasswordValid(errs.length === 0);
  }, [password]);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!isPasswordValid) {
      setPopup({ show: true, type: 'error', message: 'Password tidak memenuhi persyaratan.' });
      setTimeout(() => setPopup({ show: false, type: '', message: '' }), 2000);
      setIsLoading(false);
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/register', {
        name,
        email,
        password,
      });

      setPopup({ show: true, type: 'success', message: 'Registrasi berhasil! Mengarahkan ke login...' });
      setTimeout(() => {
        setPopup({ show: false, type: '', message: '' });
        navigate('/login');
      }, 1200);
    } catch (err) {
      console.error(err);
      setPopup({ show: true, type: 'error', message: 'Gagal mendaftar. Periksa input.' });
      setTimeout(() => {
        setPopup({ show: false, type: '', message: '' });
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // hapus bg... dari halaman, biarkan App.jsx yang mengatur background/theme root
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.form
        onSubmit={handleRegister}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white dark:bg-[#3a2a20] text-gray-800 dark:text-yellow-100 p-8 rounded-xl shadow-md w-full max-w-md space-y-5"
      >
        <h2 className="text-3xl font-bold text-center">Daftar Akun</h2>

        <input
          type="text"
          placeholder="Nama Lengkap"
          className="w-full px-4 py-2 bg-gray-100 dark:bg-[#4a3a2d] text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-400 transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 bg-gray-100 dark:bg-[#4a3a2d] text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-400 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full px-4 py-2 pr-10 bg-gray-100 dark:bg-[#4a3a2d] text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500 dark:text-yellow-200"
            aria-label="Toggle password visibility"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="text-xs text-gray-600 dark:text-yellow-300 space-y-1">
          <div className="font-medium">Persyaratan password:</div>
          <ul className="pl-4 list-disc">
            {['Minimal 8 karakter','Minimal 1 huruf kapital (A-Z)','Minimal 1 huruf kecil (a-z)','Minimal 1 angka (0-9)', 'Minimal 1 karakter spesial'].map((rule, i) => {
              const failed = passwordErrors.includes(rule);
              return (
                <li key={i} className={failed ? 'text-red-500' : 'text-green-600'}>
                  {failed ? '✖ ' : '✔ '} {rule}
                </li>
              );
            })}
          </ul>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isPasswordValid}
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
            'Daftar'
          )}
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-yellow-300">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-orange-700 dark:text-yellow-400 underline">Masuk di sini</Link>
        </p>
      </motion.form>

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
};

export default Register;
