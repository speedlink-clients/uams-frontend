import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from '@routes/index.route'
import AppProviders from '@configs/providers.config'
import { RouterProvider } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <Suspense fallback={<div>Loading...</div>}>
         <RouterProvider router={router} />
      </Suspense>
    </AppProviders>
  </StrictMode>
)
