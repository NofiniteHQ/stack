import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@nofinite/nuicss/prefixed"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
