import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaUser, FaLock, FaSignInAlt, FaCross } from 'react-icons/fa';
import { motion } from 'framer-motion';
import relacLogo from '../assets/images/relaclogo.png';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);
      if (response.success) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col justify-between">
      <Navbar transparent={false} />

      <div className="flex-1 flex items-center justify-center px-4 py-32">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden grid lg:grid-cols-2">
          
          {/* Left panel — Premium split info banner */}
          <div className="bg-gradient-to-br from-secondary via-secondary to-[#18364e] p-12 text-white flex flex-col justify-between relative overflow-hidden hidden lg:flex">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                <img src={relacLogo} alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
                <span className="font-display font-black text-xl tracking-tight text-white">RELAC 2026</span>
              </div>
              <h2 className="text-3xl font-black font-display leading-tight mb-4">
                Espace Administration <br />
                & Gestion des Inscriptions
              </h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                Connectez-vous pour suivre l'évolution des inscriptions en temps réel, gérer l'assignation des ateliers et valider les paiements.
              </p>
            </div>

            <div className="relative z-10 pt-10 border-t border-white/10 text-xs text-white/40">
              © 2026 RELAC — Centre de Gloire du Jubilé (JeLoR)
            </div>
          </div>

          {/* Right panel — Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-2xl font-black font-display text-secondary mb-1">Connexion</h1>
              <p className="text-gray-400 text-xs">Saisissez vos identifiants administratifs</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold mb-6"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1.5">Adresse Email</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-12"
                    placeholder="admin@relac2026.org"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1.5">Mot de passe</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-12"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-primary hover:underline cursor-pointer font-bold">
                  Mot de passe oublié ?
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-pill-primary py-4 text-sm font-bold flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  'Authentification...'
                ) : (
                  <>
                    <FaSignInAlt className="text-xs" /> Accéder au Dashboard
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <Link to="/" className="text-xs text-gray-400 hover:text-secondary font-bold transition-all">
                ← Retour au site public
              </Link>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;
