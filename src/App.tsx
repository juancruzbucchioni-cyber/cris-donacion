import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import FooterBasic from './components/FooterBasic';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-32 sm:pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/products" element={<Navigate to="/productos" replace />} />
          <Route path="/about" element={<Navigate to="/nosotros" replace />} />
          <Route path="/contact" element={<Navigate to="/contacto" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <FooterBasic />
    </div>
  );
}
