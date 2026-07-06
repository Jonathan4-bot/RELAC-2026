import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { participantsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  FaUser, FaIdCard, FaBook, FaBed, FaCheckCircle,
  FaClock, FaTimesCircle, FaDownload, FaQrcode, FaSpinner, FaArrowLeft, FaCross,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

function ParticipantPortal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadParticipant();
  }, [id]);

  const loadParticipant = async () => {
    try {
      setLoading(true);
      setError('');
      let response;
      try {
        response = await participantsAPI.getByMatricule(id);
      } catch (e) {
        response = await participantsAPI.getByDossier(id);
      }
      
      if (response && response.success) {
        setParticipant(response.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      setError('Dossier ou matricule non trouvé. Vérifiez votre saisie ou contactez le secrétariat.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'valide':
        return <span className="badge-success"><FaCheckCircle /> Validé</span>;
      case 'rejete':
        return <span className="badge-danger"><FaTimesCircle /> Rejeté</span>;
      default:
        return <span className="badge-warning"><FaClock /> En vérification</span>;
    }
  };



  const downloadQR = async () => {
    const codeData = participant.matricule || participant.numero_dossier;
    if (!codeData) return;
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(codeData)}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_Code_${codeData}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Impossible de télécharger le QR Code.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f9] font-sans flex flex-col justify-between pt-24">
        <Navbar transparent={false} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="loader-spinner mb-4"></div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Chargement de votre dossier...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !participant) {
    return (
      <div className="min-h-screen bg-[#f5f7f9] font-sans flex flex-col justify-between pt-24">
        <Navbar transparent={false} />
        <div className="max-w-md mx-auto px-4 py-20 w-full">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimesCircle className="text-4xl" />
            </div>
            <h1 className="text-2xl font-black text-secondary font-display mb-3">Accès impossible</h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="btn-pill-primary w-full py-4 text-xs font-bold"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f9] font-sans flex flex-col justify-between pt-24">
      <Navbar transparent={false} />

      <div className="max-w-4xl mx-auto px-4 py-10 w-full flex-1">
        
        {/* Navigation back */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-secondary transition-all cursor-pointer"
          >
            <FaArrowLeft /> Accueil
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Gorgeous event pass ticket */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="ticket-card shadow-2xl relative overflow-hidden"
            >
              {/* Ticket Header */}
              <div className="bg-secondary p-6 text-white flex justify-between items-center relative">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <img src="/src/assets/images/relaclogo.png" alt="" className="w-6 h-6 object-contain rounded" />
                    <span className="font-display font-black text-sm tracking-tight text-white">RELAC 2026</span>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-white/50 tracking-widest block">Badge Officiel Participant</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    12e Édition
                  </span>
                </div>
              </div>

              {/* Ticket Body */}
              <div className="p-6 bg-white relative flex flex-col sm:flex-row gap-6 items-center border-b border-dashed border-gray-100">
                {/* Photo */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden border bg-gray-50 shrink-0">
                  {participant.photo_url ? (
                    <img src={`${API_BASE}${participant.photo_url}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-gray-400 bg-gray-100">
                      {participant.prenom[0]}
                    </div>
                  )}
                </div>
                
                {/* Details */}
                <div className="text-center sm:text-left flex-1 space-y-1">
                  <span className="text-[9px] uppercase font-black text-primary tracking-widest">Participant</span>
                  <h2 className="text-xl font-bold font-display text-secondary leading-snug">
                    {participant.prenom} {participant.postnom} {participant.nom}
                  </h2>
                  <p className="text-xs text-gray-400">Eglise : {participant.eglise}</p>
                  <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                    {getStatusBadge(participant.statut_inscription)}
                  </div>
                </div>
              </div>

              {/* Ticket Footer / QR Block */}
              <div className="p-6 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block">Numéro d'accès</span>
                  <span className="text-lg font-black font-display text-secondary tracking-widest block mt-0.5">
                    {participant.matricule ? participant.matricule : participant.numero_dossier?.split('-')[2] || "PRE-INSCRIT"}
                  </span>
                </div>
                
                {/* Live QR Code (if validated) */}
                {participant.statut_inscription === 'valide' && (
                  <div className="w-24 h-24 bg-white p-1.5 rounded-xl border shrink-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(participant.matricule || participant.numero_dossier)}`}
                      alt="QR Access"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Practical allocations info */}
            {participant.statut_inscription === 'valide' && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <FaBook className="text-sm" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Atelier</span>
                    <strong className="text-xs text-secondary block truncate max-w-[130px]" title={participant.workshop_nom}>{participant.workshop_nom || "Auto-assigné"}</strong>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                    <FaBed className="text-sm" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Chambre</span>
                    <strong className="text-xs text-secondary block">{participant.room_nom ? `Chambre ${participant.room_nom}` : "Auto-assignée"}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Actions & details status panel */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Status explanation block */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-secondary font-display text-base mb-3">Statut de votre dossier</h3>
              
              {participant.statut_inscription === 'valide' ? (
                <div className="space-y-4 text-xs text-gray-500 leading-relaxed">
                  <p className="text-emerald-600 font-bold">Votre dossier est entièrement en règle ! ✓</p>
                  <p>Nous vous souhaitons la bienvenue et N'oubliez pas de jetter un coup d'oeil à l'acceuil afin d'avoir des détails sur la ReLAc2026.</p>
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={downloadQR}
                      className="w-full btn-pill-light border-gray-200 text-secondary hover:bg-gray-50 py-3.5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FaQrcode /> Télécharger mon QR Code
                    </button>
                  </div>
                </div>
              ) : participant.statut_inscription === 'rejete' ? (
                <div className="text-xs text-gray-500 leading-relaxed">
                  <p className="text-red-600 font-bold mb-2">Dossier rejeté ou non validé</p>
                  <p>Votre pré-inscription n'a pas pu être validée par notre secrétariat. Cela est généralement dû à une preuve de paiement erronée ou manquante.</p>
                  <p className="mt-2">Veuillez contacter le service d'accueil pour régulariser votre dossier.</p>
                </div>
              ) : (
                <div className="text-xs text-gray-500 leading-relaxed">
                  <p className="text-orange-600 font-bold mb-2">Vérification en cours...</p>
                  <p>Votre inscription est bien enregistrée sous le numéro <strong className="text-secondary">{participant.numero_dossier}</strong>.</p>
                  <p className="mt-2">Notre équipe financière procède actuellement à la vérification de votre transaction de paiement. Vous recevrez une notification par email dès que le badge sera prêt.</p>
                </div>
              )}
            </div>

            {/* Dossier recap details list */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-secondary font-display text-base mb-4">Résumé de dossier</h3>
              <div className="space-y-3 text-xs text-gray-500">
                <div className="flex justify-between border-b pb-2">
                  <span>Numéro Dossier:</span>
                  <strong className="text-secondary">{participant.numero_dossier}</strong>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Téléphone:</span>
                  <strong className="text-secondary">{participant.telephone}</strong>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Mode Paiement:</span>
                  <strong className="text-secondary">{participant.mode_paiement}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Date Inscription:</span>
                  <strong className="text-secondary">{new Date(participant.date_inscription).toLocaleDateString('fr-FR')}</strong>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ParticipantPortal;
