import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/Layout/DashboardLayout'

import Home from './pages/Home'
import About from './pages/About'
import Impact from './pages/Impact'
import Sponsor from './pages/Sponsor'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

import ChildrenPage from './components/Dashboard/ChildrenPage'
import ChildProfile from './components/Dashboard/ChildProfile'
import StaffPage from './components/Dashboard/StaffPage'
import DonationsPage from './components/Dashboard/DonationsPage'
import HealthPage from './components/Dashboard/HealthPage'
import EducationPage from './components/Dashboard/EducationPage'
import SponsorsPage from './components/Dashboard/SponsorsPage'
import AlertsPage from './components/Dashboard/AlertsPage'
import ReportsPage from './components/Dashboard/ReportsPage'
import ProfilePage from './components/Dashboard/ProfilePage'

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#0B1120] flex flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/sponsor" element={<Sponsor />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="children" element={<ChildrenPage />} />
        <Route path="children/:id" element={<ChildProfile />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="donations" element={<DonationsPage />} />
        <Route path="health" element={<HealthPage />} />
        <Route path="education" element={<EducationPage />} />
        <Route path="sponsors" element={<SponsorsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}