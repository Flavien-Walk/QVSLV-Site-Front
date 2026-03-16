import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Particles from './components/Particles'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dossiers from './pages/Dossiers'
import Archives from './pages/Archives'
import Theories from './pages/Theories'
import Ressources from './pages/Ressources'

export default function App() {
  return (
    <>
      <Particles />
      <div className="frame" aria-hidden="true">
        <div className="frame-corner frame-corner--tl" />
        <div className="frame-corner frame-corner--tr" />
        <div className="frame-corner frame-corner--bl" />
        <div className="frame-corner frame-corner--br" />
        <div className="frame-border frame-border--top" />
        <div className="frame-border frame-border--bottom" />
        <div className="frame-border frame-border--left" />
        <div className="frame-border frame-border--right" />
      </div>
      <Header />
      <main className="layout">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dossiers" element={<Dossiers />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/theories" element={<Theories />} />
          <Route path="/ressources" element={<Ressources />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
