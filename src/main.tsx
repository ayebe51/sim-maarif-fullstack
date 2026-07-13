import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Register PWA Service Worker
registerSW({ immediate: true })

// Initialize Convex client
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL!)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </StrictMode>,
)
