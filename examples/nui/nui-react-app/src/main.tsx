import { createRoot } from 'react-dom/client'
import { Providers } from './providers.tsx'
import App from './App.tsx'
import "@nofinite/nui/styles.css"
import "@nofinite/nuicss"
// import "./theme.css"


createRoot(document.getElementById('root')!).render(
  <Providers>
    <App />
  </Providers>
)
