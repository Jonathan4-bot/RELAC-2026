import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { participantsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaIdCard, FaPhone, FaLock, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

function PortailLogin() {
  const [numeroDossier, setNumeroDossier] = useState('');
  const [telephone, setTelephone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Récupérer les infos du participant via le numéro de dossier
      const response = await participantsAPI.getByDossier(numeroDossier.trim());

      if (!response || !response.success) {
        throw new Error('Numéro de dossier introuvable.');
      }

      const participant = response.data;

      // Vérifier que le téléphone correspond
      const telSaisi = telephone.trim().replace(/\s/g, '');
      const telEnregistre = (participant.telephone || '').trim().replace(/\s/g, '');

      if (telSaisi !== telEnregistre) {
        setError('Le numéro de téléphone ne correspond pas à ce dossier. Vérifiez votre saisie.');
        return;
      }

      // Authentification réussie → redirection vers le portail
      navigate(`/participant/${numeroDossier.trim()}`);
    } catch (err) {
      if (err.message === 'Le numéro de téléphone ne correspond pas à ce dossier. Vérifiez votre saisie.') {
        setError(err.message);
      } else {
        setError('Numéro de dossier introuvable. Vérifiez votre saisie ou contactez le secrétariat.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col justify-between">
      <Navbar transparent={false} />

      <div className="flex-1 flex items-center justify-center px-4 py-32">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          <div className="bg-primary/5 p-8 text-center border-b border-gray-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary">
              <FaLock className="text-2xl" />
            </div>
            <h2 className="text-2xl font-black font-display text-secondary">
              Mon Portail
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Accédez à votre espace participant pour suivre l'état de votre dossier.
            </p>
          </div>

          <div className="p-8">
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
              {/* Numéro de dossier */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-2">
                  Numéro de Dossier
                </label>
                <div className="relative">
                  <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={numeroDossier}
                    onChange={(e) => setNumeroDossier(e.target.value)}
                    className="input-field pl-12"
                    placeholder="Ex: ReLAc2026-001"
                    required
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Numéro reçu lors de votre inscription.
                </p>
              </div>

              {/* Numéro de téléphone (vérification) */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-2">
                  Numéro de Téléphone
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="input-field pl-12"
                    placeholder="Ex: +243812345678"
                    required
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Le numéro de téléphone utilisé lors de votre inscription.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-pill-primary py-4 text-sm font-bold flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  'Vérification...'
                ) : (
                  <>
                    <FaSearch className="text-xs" /> Accéder à mon portail
                  </>
                )}
              </button>
            </form>
          </div>
          
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PortailLogin;
