import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, participantsAPI, authAPI, exportAPI, presenceAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  FaUsers, FaUserCheck, FaMoneyBillWave, FaChartBar,
  FaBed, FaBook, FaSignOutAlt, FaSignInAlt, FaDownload, FaSearch,
  FaEye, FaCheckCircle, FaTimesCircle, FaGenderless,
  FaFileExcel, FaFilePdf, FaSpinner, FaQrcode, FaCheck, FaPhoneAlt, FaFileMedical, FaTrash,
  FaHistory, FaExchangeAlt,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sexeFilter, setSexeFilter] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState('');
  
  // Custom states for validation options
  const [selectedWorkshopId, setSelectedWorkshopId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [validationLoading, setValidationLoading] = useState(false);

  // States for Presence QR Scanning
  const [livePresences, setLivePresences] = useState([]);
  const [liveStats, setLiveStats] = useState({ total_scans_jour: 0, participants_sortis: 0, participants_rentres: 0 });
  const [scanMatricule, setScanMatricule] = useState('');
  const [scanType, setScanType] = useState('sortie'); // 'sortie' | 'entree'
  const [scanNote, setScanNote] = useState('');
  const [scanLoading, setScanLoading] = useState(false);
  const [scanMessage, setScanMessage] = useState(null); // { success: boolean, text: string }

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [dashboardData, participantsData, liveData] = await Promise.all([
        adminAPI.getDashboard(),
        participantsAPI.getAll(),
        presenceAPI.getLive(),
      ]);
      setStats(dashboardData.data);
      setParticipants(participantsData.data);
      setLivePresences(liveData.presences);
      setLiveStats(liveData.resume);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      if (error.message.includes('Token') || error.message.includes('non autorisé')) {
        authAPI.logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadLivePresences = async () => {
    try {
      const data = await presenceAPI.getLive();
      setLivePresences(data.presences);
      setLiveStats(data.resume);
    } catch (error) {
      console.error('Error loading live presences:', error);
    }
  };

  const handleScanSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!scanMatricule.trim()) return;

    setScanLoading(true);
    setScanMessage(null);

    try {
      const res = await presenceAPI.scan(scanMatricule.trim(), scanType, scanNote);
      setScanMessage({ success: true, text: res.message });
      setScanMatricule('');
      setScanNote('');
      
      // Reload stats and logs
      await loadLivePresences();
      await loadDashboard();
    } catch (error) {
      setScanMessage({ success: false, text: error.message || 'Erreur lors du scan du code.' });
    } finally {
      setScanLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  const handleValidate = async (participantId) => {
    try {
      setValidationLoading(true);
      const wId = selectedWorkshopId ? parseInt(selectedWorkshopId) : undefined;
      const rId = selectedRoomId ? parseInt(selectedRoomId) : undefined;
      
      await participantsAPI.validate(participantId, wId, rId);
      await loadDashboard();
      setShowModal(false);
      setSelectedParticipant(null);
      setSelectedWorkshopId('');
      setSelectedRoomId('');
    } catch (error) {
      alert('Erreur lors de la validation: ' + error.message);
    } finally {
      setValidationLoading(false);
    }
  };

  const handleReject = async (participantId) => {
    if (!confirm('Êtes-vous sûr de vouloir rejeter cette inscription ?')) return;
    try {
      setValidationLoading(true);
      await participantsAPI.reject(participantId);
      await loadDashboard();
      setShowModal(false);
      setSelectedParticipant(null);
    } catch (error) {
      alert('Erreur lors du rejet: ' + error.message);
    } finally {
      setValidationLoading(false);
    }
  };

  const handleDelete = async (participantId) => {
    if (!confirm('ATTENTION: Cette action est irréversible. Voulez-vous vraiment supprimer définitivement ce participant ?')) return;
    try {
      setLoading(true);
      await participantsAPI.delete(participantId);
      await loadDashboard();
      setShowModal(false);
      setSelectedParticipant(null);
    } catch (error) {
      alert('Erreur lors de la suppression: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    setExporting(true);
    setExportMsg(`Génération du fichier ${type.toUpperCase()}...`);
    try {
      const response = type === 'excel' 
        ? await exportAPI.exportExcel({ statut_inscription: statusFilter || undefined })
        : await exportAPI.exportPDF({ statut_inscription: statusFilter || undefined });
      
      if (response.success && response.data.download_url) {
        window.open(`${API_BASE}${response.data.download_url}`, '_blank');
        setExportMsg(`${type.toUpperCase()} généré avec succès !`);
      }
    } catch (error) {
      setExportMsg(`Erreur: ${error.message}`);
    } finally {
      setTimeout(() => { setExporting(false); setExportMsg(''); }, 2000);
    }
  };

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = !searchTerm || 
      p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.telephone?.includes(searchTerm) ||
      p.numero_dossier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.matricule?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || p.statut_inscription === statusFilter;
    const matchesSexe = !sexeFilter || p.sexe === sexeFilter;
    
    return matchesSearch && matchesStatus && matchesSexe;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa]">
        <div className="loader-spinner mb-4"></div>
        <p className="text-sm text-gray-500 font-display font-semibold">Chargement des données RELAC...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f9] font-sans flex flex-col justify-between pt-24">
      <Navbar transparent={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Header Block */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-secondary font-display">Dashboard d'Administration</h1>
            <p className="text-gray-400 text-sm mt-1">Gestion centrale de la Retraite du Libre Accès (RELAC 2026)</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => loadDashboard()}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              Actualiser
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-xs font-bold text-red-600 hover:bg-red-100 transition-all flex items-center gap-2 cursor-pointer ml-auto md:ml-0"
            >
              <FaSignOutAlt /> Déconnexion
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[
              { label: "Total Inscriptions", val: stats.participants.total, sub: "Toutes confondues", icon: <FaUsers />, color: "from-secondary to-secondary-light" },
              { label: "Hommes / Femmes", val: `${stats.participants.hommes} / ${stats.participants.femmes}`, sub: "Répartition", icon: <FaGenderless />, color: "from-blue-500 to-indigo-600" },
              { label: "Paiements Validés", val: stats.participants.paiements_valides, sub: `${stats.participants.paiements_valides * 20} USD encaissés`, icon: <FaUserCheck />, color: "from-primary to-primary-dark" },
              { label: "En attente", val: stats.participants.paiements_en_attente, sub: "À valider manuellement", icon: <FaChartBar />, color: "from-accent to-accent-dark" },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">{card.label}</span>
                  <span className="text-2xl md:text-3xl font-black text-secondary font-display block mt-1">{card.val}</span>
                  <span className="text-[10px] text-gray-400 font-medium block mt-1">{card.sub}</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-50 text-secondary flex items-center justify-center text-lg border">
                  {card.icon}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Action Panel & Filters */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          
          {/* Tabs */}
          <div className="flex flex-wrap border-b border-gray-100 text-sm">
            {[
              { id: 'overview', label: 'Participants', count: participants.length },
              { id: 'workshops', label: 'Ateliers', count: stats?.workshops.length },
              { id: 'rooms', label: 'Chambres', count: stats?.rooms.length },
              { id: 'presence', label: 'Entrées/Sorties', count: liveStats?.total_scans_jour }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'presence') {
                    loadLivePresences();
                  }
                }}
                className={`px-6 py-4 font-bold font-display transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary text-primary bg-primary/5'
                    : 'text-gray-400 hover:text-secondary'
                }`}
              >
                {tab.label} {tab.count !== undefined && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px] font-normal text-gray-500">{tab.count}</span>}
              </button>
            ))}
          </div>

          {/* TAB 1: PARTICIPANTS */}
          {activeTab === 'overview' && (
            <div className="p-6">
              
              {/* Filters row */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, dossier, matricule, tel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field text-xs font-semibold w-36"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="en_attente">En attente</option>
                    <option value="valide">Validé</option>
                    <option value="rejete">Rejeté</option>
                  </select>
                  <select
                    value={sexeFilter}
                    onChange={(e) => setSexeFilter(e.target.value)}
                    className="input-field text-xs font-semibold w-28"
                  >
                    <option value="">Tous sexes</option>
                    <option value="Masculin">Masculins</option>
                    <option value="Féminin">Féminins</option>
                  </select>
                  <button
                    onClick={() => handleExport('excel')}
                    disabled={exporting}
                    className="px-4 py-3 rounded-xl bg-[#22c55e] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#16a34a] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <FaFileExcel /> Excel
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    disabled={exporting}
                    className="px-4 py-3 rounded-xl bg-[#ef4444] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#dc2626] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <FaFilePdf /> PDF
                  </button>
                </div>
              </div>

              {exportMsg && (
                <div className="mb-4 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-4 py-2.5 rounded-xl">
                  {exportMsg}
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Participant</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Contact</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Sexe</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Église</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Statut</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipants.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-10 text-center text-xs text-gray-400 font-medium">
                          Aucun participant ne correspond aux critères de recherche.
                        </td>
                      </tr>
                    ) : (
                      filteredParticipants.map((p) => (
                        <tr key={p.id} className="border-b border-gray-100/55 hover:bg-gray-50/50 transition-all">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                {p.photo_url ? (
                                  <img src={`${API_BASE}${p.photo_url}`} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400 bg-gray-100">
                                    {p.prenom[0]}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-secondary text-sm font-display leading-snug">{p.prenom} {p.nom}</p>
                                <span className="text-[10px] text-gray-400 tracking-wider">
                                  {p.matricule ? p.matricule : `Dossier: ${p.numero_dossier?.split('-')[2] || p.numero_dossier}`}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-xs">
                            <p className="text-secondary font-medium">{p.telephone}</p>
                            <span className="text-gray-400">{p.email || 'Aucun email'}</span>
                          </td>
                          <td className="p-4 text-xs">
                            <span className={`px-2.5 py-1 rounded-full font-bold ${
                              p.sexe === 'Masculin' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                            }`}>
                              {p.sexe}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-gray-500 font-medium">{p.eglise}</td>
                          <td className="p-4 text-xs">
                            <span className={`px-2.5 py-1 rounded-full font-black uppercase text-[9px] tracking-wider ${
                              p.statut_inscription === 'valide' ? 'bg-emerald-50 text-emerald-600' :
                              p.statut_inscription === 'rejete' ? 'bg-red-50 text-red-600' :
                              'bg-orange-50 text-orange-600'
                            }`}>
                              {p.statut_inscription}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => {
                                  setSelectedParticipant(p);
                                  setShowModal(true);
                                }}
                                className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer"
                                title="Voir détails"
                              >
                                <FaEye />
                              </button>
                              {p.statut_inscription === 'en_attente' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedParticipant(p);
                                      setShowModal(true);
                                    }}
                                    className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                                    title="Valider"
                                  >
                                    <FaCheckCircle />
                                  </button>
                                  <button
                                    onClick={() => handleReject(p.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                    title="Rejeter"
                                  >
                                    <FaTimesCircle />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: WORKSHOPS */}
          {activeTab === 'workshops' && stats && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.workshops.map((w) => (
                  <div key={w.id} className="bg-gray-50 border border-gray-200/50 rounded-2xl p-5">
                    <h3 className="font-bold text-secondary font-display mb-1 text-base">{w.nom}</h3>
                    <div className="flex justify-between items-center text-xs mt-3 mb-2">
                      <span className="text-gray-400">Taux de remplissage</span>
                      <span className="font-bold text-secondary">{w.nombre_participants} / {w.capacite_max}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-500" style={{ width: `${w.taux_remplissage}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-primary block mt-2">{w.taux_remplissage}% de capacité</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ROOMS */}
          {activeTab === 'rooms' && stats && (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {stats.rooms.map((r) => (
                  <div key={r.id} className="bg-white border border-gray-200/60 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <span className="font-bold text-secondary font-display text-sm">Chambre {r.nom}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          r.sexe === 'Masculin' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                        }`}>{r.sexe}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs mt-3 mb-1">
                        <span className="text-gray-400 font-medium">Occupants</span>
                        <span className="font-bold text-secondary">{r.nombre_occupants} / {r.capacite_max}</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${r.taux_remplissage}%` }} />
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-4">{r.taux_remplissage}% occupée</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* TAB 4: PRESENCE SCANNING */}
          {activeTab === 'presence' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* FORM PANEL (LEFT) */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-gray-50 border border-gray-200/60 rounded-2xl p-5">
                    <h3 className="font-bold text-secondary font-display mb-3 text-base flex items-center gap-2">
                      <FaQrcode className="text-primary" /> Enregistrer un Scan QR
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                      Saisissez le matricule ou le numéro de dossier figurant sur le badge du participant pour enregistrer sa sortie ou son entrée.
                    </p>

                    <form onSubmit={handleScanSubmit} className="space-y-4">
                      {/* Matricule/Code */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1.5">
                          Matricule ou Numéro de Dossier *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Ex: REC-2026-XXXXX"
                            value={scanMatricule}
                            onChange={(e) => setScanMatricule(e.target.value)}
                            className="input-field pl-10"
                            required
                          />
                          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        </div>
                      </div>

                      {/* Dropdown de raccourci pour sélectionner un participant validé */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1.5">
                          Ou sélectionner un participant validé
                        </label>
                        <select
                          onChange={(e) => setScanMatricule(e.target.value)}
                          className="input-field text-xs font-semibold"
                          value={scanMatricule}
                        >
                          <option value="">-- Choisir dans la liste --</option>
                          {participants
                            .filter(p => p.statut_inscription === 'valide')
                            .map(p => (
                              <option key={p.id} value={p.matricule || p.numero_dossier}>
                                {p.prenom} {p.nom} ({p.matricule || p.numero_dossier})
                              </option>
                            ))
                          }
                        </select>
                      </div>

                      {/* Type: Sortie vs Entrée Toggle */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1.5">
                          Mouvement *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setScanType('sortie')}
                            className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                              scanType === 'sortie'
                                ? 'bg-red-50 border-red-200 text-red-600 shadow-sm'
                                : 'bg-white border-gray-200 text-gray-400 hover:text-secondary'
                            }`}
                          >
                            <FaSignOutAlt /> SORTIE
                          </button>
                          <button
                            type="button"
                            onClick={() => setScanType('entree')}
                            className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                              scanType === 'entree'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm'
                                : 'bg-white border-gray-200 text-gray-400 hover:text-secondary'
                            }`}
                          >
                            <FaSignInAlt /> ENTRÉE
                          </button>
                        </div>
                      </div>

                      {/* Note */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1.5">
                          Note / Motif (Facultatif)
                        </label>
                        <textarea
                          placeholder="Ex: Pharmacie, Achat, Visite..."
                          value={scanNote}
                          onChange={(e) => setScanNote(e.target.value)}
                          className="input-field h-20 text-xs py-2"
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={scanLoading}
                        className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-white shadow-glow transition-all ${
                          scanType === 'sortie' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'
                        } disabled:opacity-50`}
                      >
                        {scanLoading ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaCheck />
                        )}
                        ENREGISTRER LE SCAN
                      </button>
                    </form>

                    {/* Scan Message Display */}
                    {scanMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-4 p-4 rounded-xl border text-xs font-semibold leading-relaxed ${
                          scanMessage.success
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                            : 'bg-red-50 border-red-100 text-red-800'
                        }`}
                      >
                        {scanMessage.text}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* LOGS PANEL (RIGHT) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Live Mini Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 border border-gray-200/50 rounded-2xl p-4 text-center">
                      <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Scans du jour</span>
                      <span className="block text-xl font-black text-secondary font-display mt-1">{liveStats.total_scans_jour}</span>
                    </div>
                    <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 text-center">
                      <span className="block text-[10px] uppercase font-bold text-red-400 tracking-wider">Actuellement Sortis</span>
                      <span className="block text-xl font-black text-red-600 font-display mt-1">{liveStats.participants_sortis}</span>
                    </div>
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-center">
                      <span className="block text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Rentrés</span>
                      <span className="block text-xl font-black text-emerald-600 font-display mt-1">{liveStats.participants_rentres}</span>
                    </div>
                  </div>

                  {/* Logs list */}
                  <div className="bg-white border border-gray-200/60 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-secondary font-display text-base flex items-center gap-2">
                        <FaHistory className="text-primary text-xs" /> Mouvements récents de la journée
                      </h3>
                      <button
                        onClick={loadLivePresences}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        Actualiser
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                      {livePresences.length === 0 ? (
                        <div className="text-center py-12 text-xs text-gray-400 font-medium">
                          Aucun mouvement enregistré aujourd'hui.
                        </div>
                      ) : (
                        livePresences.map((log) => (
                          <div
                            key={log.id}
                            className="flex items-center justify-between p-3.5 bg-gray-50/60 hover:bg-gray-50 border border-gray-100 rounded-xl transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-white">
                                {log.photo_url ? (
                                  <img src={`${API_BASE}${log.photo_url}`} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                                    {log.prenom[0]}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-secondary text-xs leading-snug">
                                  {log.prenom} {log.nom}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                  {log.eglise} • Matricule: <strong className="text-gray-600">{log.matricule}</strong>
                                </p>
                                {log.note && (
                                  <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5 mt-1.5 inline-block font-medium">
                                    ✍️ Note : {log.note}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                log.type === 'sortie'
                                  ? 'bg-red-50 text-red-600'
                                  : 'bg-emerald-50 text-emerald-600'
                              }`}>
                                {log.type === 'sortie' ? <FaSignOutAlt /> : <FaSignInAlt />} {log.type}
                              </span>
                              <span className="block text-[10px] text-gray-400 font-bold mt-1.5">
                                {log.heure.split(' ')[1] || log.heure}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL (PREMIUM & DETAILED) */}
      <AnimatePresence>
        {showModal && selectedParticipant && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-3xl">
                <div>
                  <h3 className="text-lg font-black text-secondary font-display">Fiche Participant</h3>
                  <p className="text-xs text-gray-400">Détails d'inscription & validation de dossier</p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedParticipant(null);
                    setSelectedWorkshopId('');
                    setSelectedRoomId('');
                  }}
                  className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-all text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                
                {/* Visual Identity Strip */}
                <div className="flex flex-col sm:flex-row gap-5 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border bg-gray-100 shrink-0">
                    {selectedParticipant.photo_url ? (
                      <img src={`${API_BASE}${selectedParticipant.photo_url}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-gray-400 bg-gray-100">
                        {selectedParticipant.prenom[0]}
                      </div>
                    )}
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h4 className="text-xl font-bold font-display text-secondary">{selectedParticipant.prenom} {selectedParticipant.postnom} {selectedParticipant.nom}</h4>
                    <p className="text-xs text-gray-400 mt-1">Dossier : {selectedParticipant.numero_dossier}</p>
                    <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {selectedParticipant.sexe}
                      </span>
                      <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Né(e) le {new Date(selectedParticipant.date_naissance).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Personal & Church Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-bold text-sm text-secondary font-display border-b pb-1.5 flex items-center gap-2">
                      <FaUsers className="text-primary text-xs" /> Informations & Église
                    </h5>
                    <div className="space-y-2 text-xs">
                      <p><span className="text-gray-400">Téléphone:</span> <strong>{selectedParticipant.telephone}</strong></p>
                      <p><span className="text-gray-400">WhatsApp:</span> <strong>{selectedParticipant.whatsapp || '-'}</strong></p>
                      <p><span className="text-gray-400">Email:</span> <strong>{selectedParticipant.email || '-'}</strong></p>
                      <p><span className="text-gray-400">Adresse:</span> <strong>{selectedParticipant.adresse || '-'}</strong></p>
                      <p className="border-t pt-2"><span className="text-gray-400 font-bold block mb-1">Détails Ecclésiastiques :</span></p>
                      <p><span className="text-gray-400">Paroisse / Église:</span> <strong>{selectedParticipant.eglise}</strong></p>
                      <p><span className="text-gray-400">Département:</span> <strong>{selectedParticipant.departement || '-'}</strong></p>
                      <p><span className="text-gray-400">Fonction:</span> <strong>{selectedParticipant.fonction || '-'}</strong></p>
                      <p><span className="text-gray-400">Responsable Spirituel:</span> <strong>{selectedParticipant.responsable_spirituel || '-'}</strong></p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-bold text-sm text-secondary font-display border-b pb-1.5 flex items-center gap-2">
                      <FaPhoneAlt className="text-primary text-xs" /> Urgence & Fiche Médicale
                    </h5>
                    <div className="space-y-2 text-xs">
                      <p><span className="text-gray-400">Contact d'urgence:</span> <strong>{selectedParticipant.urgence_nom}</strong></p>
                      <p><span className="text-gray-400">Relation / Lien:</span> <strong>{selectedParticipant.urgence_lien}</strong></p>
                      <p><span className="text-gray-400">Téléphone d'urgence:</span> <strong>{selectedParticipant.urgence_telephone}</strong></p>
                      
                      <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 mt-3 space-y-2">
                        <span className="font-bold text-red-700 flex items-center gap-1.5 mb-1">
                          <FaFileMedical /> Santé
                        </span>
                        <p><span className="text-gray-400">Maladies:</span> <strong>{selectedParticipant.maladie_chronique || 'Aucune'}</strong></p>
                        <p><span className="text-gray-400">Allergies:</span> <strong>{selectedParticipant.allergies || 'Aucune'}</strong></p>
                        <p><span className="text-gray-400">Restrictions Alimentaires:</span> <strong>{selectedParticipant.restrictions_alimentaires || 'Aucune'}</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proof of Payment View */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/50">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-secondary mb-3 flex items-center gap-2">
                    <FaMoneyBillWave className="text-primary" /> Détails du paiement ({selectedParticipant.mode_paiement})
                  </h5>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="text-xs space-y-1 flex-1">
                      <p><span className="text-gray-400">Mode de paiement:</span> <strong>{selectedParticipant.mode_paiement}</strong></p>
                      {selectedParticipant.reference_paiement && (
                        <p><span className="text-gray-400">ID de transaction:</span> <strong className="text-primary tracking-widest uppercase">{selectedParticipant.reference_paiement}</strong></p>
                      )}
                    </div>
                    {selectedParticipant.preuve_paiement_url && (
                      <div className="w-full sm:w-48 aspect-[4/3] rounded-xl overflow-hidden border bg-white shrink-0 shadow-sm relative group cursor-pointer">
                        <img src={`${API_BASE}${selectedParticipant.preuve_paiement_url}`} alt="Preuve" className="w-full h-full object-cover" />
                        <a
                          href={`${API_BASE}${selectedParticipant.preuve_paiement_url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white text-xs font-bold"
                        >
                          Agrandir
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Validation / Assignment Block */}
                {selectedParticipant.statut_inscription === 'en_attente' && (
                  <div className="p-4 bg-primary-light rounded-2xl border border-primary/20 space-y-4">
                    <h5 className="font-bold text-sm text-secondary font-display flex items-center gap-2">
                      <FaCheckCircle className="text-primary" /> Assignation & Validation
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1.5">Atelier (Facultatif)</label>
                        <select
                          value={selectedWorkshopId}
                          onChange={(e) => setSelectedWorkshopId(e.target.value)}
                          className="input-field text-xs font-semibold bg-white"
                        >
                          <option value="">-- Assigner automatiquement --</option>
                          {stats?.workshops.map(w => (
                            <option key={w.id} value={w.id}>{w.nom} ({w.nombre_participants}/{w.capacite_max})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1.5">Chambre (Facultatif)</label>
                        <select
                          value={selectedRoomId}
                          onChange={(e) => setSelectedRoomId(e.target.value)}
                          className="input-field text-xs font-semibold bg-white"
                        >
                          <option value="">-- Assigner automatiquement --</option>
                          {stats?.rooms
                            .filter(r => r.sexe === selectedParticipant.sexe)
                            .map(r => (
                              <option key={r.id} value={r.id}>Chambre {r.nom} ({r.nombre_occupants}/{r.capacite_max})</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleValidate(selectedParticipant.id)}
                        disabled={validationLoading}
                        className="flex-1 btn-pill-primary py-3.5 text-xs font-bold flex items-center justify-center gap-2"
                      >
                        {validationLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />} Valider l'inscription
                      </button>
                      <button
                        onClick={() => handleReject(selectedParticipant.id)}
                        disabled={validationLoading}
                        className="px-6 py-3.5 rounded-xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-1.5"
                      >
                        Rejeter
                      </button>
                    </div>
                  </div>
                )}

                {/* Registered info display */}
                {selectedParticipant.statut_inscription === 'valide' && (
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-xs space-y-1 text-emerald-800 flex-1">
                      <p><strong>Dossier Validé ✓</strong></p>
                      <p>Atelier assigné : <strong>{selectedParticipant.workshop_nom || 'Non spécifié'}</strong></p>
                      <p>Chambre assignée : <strong>Chambre {selectedParticipant.room_nom || 'Non spécifiée'}</strong></p>
                    </div>
                    
                    <div className="shrink-0 text-center flex flex-col items-center border-l border-emerald-200/50 pl-4">
                      <div className="bg-white p-2 rounded-xl shadow-sm border border-emerald-100 mb-2">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(selectedParticipant.matricule || selectedParticipant.numero_dossier)}`}
                          alt="QR Code" 
                          className="w-16 h-16"
                        />
                      </div>
                      <a 
                        href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(selectedParticipant.matricule || selectedParticipant.numero_dossier)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <FaQrcode /> Ouvrir QR
                      </a>
                    </div>

                    <button
                      onClick={() => handleDelete(selectedParticipant.id)}
                      className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 border border-red-100 ml-2"
                    >
                      <FaTrash /> Supprimer
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
