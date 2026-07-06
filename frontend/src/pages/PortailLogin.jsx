import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaIdCard, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

function PortailLogin() {
  const [identifier, setIdentifier] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (identifier.trim()) {
      navigate(`/participant/${identifier.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col justify-between">
      <Navbar transparent={false} />

      <div className="flex-1 flex items-center justify-center px-4 py-32">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          <div className="bg-primary/5 p-8 text-center border-b border-gray-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary">
              <FaIdCard className="text-2xl" />
            </div>
            <h2 className="text-2xl font-black font-display text-secondary">
              Mon Portail
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Accédez à votre espace participant pour suivre votre dossier et télécharger votre badge.
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-2">
                  Matricule ou Numéro de Dossier
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="input-field pl-12"
                    placeholder="Ex: ReLAc2026-001"
                    required
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2">
                  Saisissez le numéro qui vous a été attribué lors de votre pré-inscription.
                </p>
              </div>

              <button
                type="submit"
                className="w-full btn-pill-primary py-4 text-sm font-bold flex items-center justify-center gap-2"
              >
                Accéder à mon portail
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
