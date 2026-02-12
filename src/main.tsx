import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    )
  } catch (e) {
    console.error("Critical error in main.tsx:", e);
    rootElement.innerHTML = '<div style="color:red; padding:20px;"><h1>Critical Error</h1><p>Check console details.</p></div>';
  }
}
