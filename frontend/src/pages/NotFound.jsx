import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f7f9] font-sans flex flex-col justify-between pt-24">
      <Navbar transparent={false} />

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <FaExclamationTriangle className="text-3xl" />
          </div>
          
          <h1 className="text-6xl font-black text-secondary font-display mb-2">404</h1>
          <h2 className="text-xl font-bold text-secondary mb-4">Page Introuvable</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          <Link
            to="/"
            className="btn-pill-primary w-full py-4 text-xs font-bold flex items-center justify-center gap-2"
          >
            <FaArrowLeft /> Retour à l'accueil
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default NotFound;
