import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { GlobalProvider } from './context/global.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalProvider>
      <App />
      <Toaster/>
    </GlobalProvider>
  </StrictMode>,
)
