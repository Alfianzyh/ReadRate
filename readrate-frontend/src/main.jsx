import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { applyInitialTheme } from './utils/theme';
import { ThemeProvider } from './context/ThemeContext';

// apply theme before loading styles / mounting React
try {
  applyInitialTheme();
} catch (e) {
  // ignore — best-effort
}

// load CSS after theme application so initial paint respects theme, then mount
import('./index.css').then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}).catch(() => {
  // if CSS fail to load, still mount app to avoid blocking dev flow
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
})
