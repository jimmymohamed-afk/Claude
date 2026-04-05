import { Routes, Route, Navigate } from 'react-router-dom'
import { MenuPage } from './components/menu/MenuPage'
import { lazy, Suspense } from 'react'

const AdminLayout = lazy(() =>
  import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout }))
)

function AdminFallback() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center text-text-main/50 font-body">
      Loading admin...
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLayout />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
