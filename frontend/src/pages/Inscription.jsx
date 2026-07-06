import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { participantsAPI } from "../services/api";
import {
  FaUser, FaChurch, FaPhoneAlt, FaHeartbeat,
  FaCreditCard, FaCheckCircle, FaMoneyBillWave,
  FaMobileAlt, FaArrowRight, FaArrowLeft, FaCamera, FaUpload,
} from "react-icons/fa";

function Inscription() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nom: "", postnom: "", prenom: "", sexe: "",
    date_naissance: "", telephone: "", whatsapp: "", email: "", adresse: "",
    photo: null, photoPreview: null,
    eglise: "", departement: "", fonction: "", responsable_spirituel: "", deja_participe: "", comment_connu: "",
    urgence_nom: "", urgence_lien: "", urgence_telephone: "",
    maladie_chronique: "", allergies: "", restrictions_alimentaires: "", traitements_medicaux: "", infos_medicales_complementaires: "",
    mode_paiement: "", reference_paiement: "", preuve_paiement: null, preuvePreview: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        [field]: file,
        [`${field}Preview`]: URL.createObjectURL(file),
      });
    }
  };

  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.nom || !formData.prenom || !formData.sexe || !formData.telephone || !formData.date_naissance) {
        setError("Veuillez remplir tous les champs obligatoires (*) d'identité.");
        return false;
      }
    } else if (step === 2) {
      if (!formData.eglise || !formData.deja_participe) {
        setError("Veuillez remplir les informations concernant votre église.");
        return false;
      }
    } else if (step === 3) {
      if (!formData.urgence_nom || !formData.urgence_telephone || !formData.urgence_lien) {
        setError("Veuillez renseigner le contact d'urgence complet.");
        return false;
      }
    } else if (step === 5) {
      if (!formData.mode_paiement) {
        setError("Veuillez choisir un mode de paiement.");
        return false;
      }
      if (formData.mode_paiement !== "Cash" && !formData.reference_paiement) {
        setError("Veuillez saisir la référence du paiement mobile.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formPayload = new FormData();
      
      const textFields = [
        'nom', 'postnom', 'prenom', 'sexe', 'date_naissance', 'telephone', 
        'whatsapp', 'email', 'adresse', 'eglise', 'departement', 'fonction', 
        'responsable_spirituel', 'urgence_nom', 'urgence_lien', 'urgence_telephone',
        'maladie_chronique', 'allergies', 'restrictions_alimentaires', 'traitements_medicaux',
        'infos_medicales_complementaires', 'mode_paiement', 'reference_paiement',
        'deja_participe', 'comment_connu'
      ];
      
      textFields.forEach(field => {
        if (formData[field] !== undefined && formData[field] !== null) {
          formPayload.append(field, formData[field]);
        }
      });

      if (formData.photo) {
        formPayload.append('photo', formData.photo);
      }
      if (formData.preuve_paiement) {
        formPayload.append('preuve_paiement', formData.preuve_paiement);
      }

      const response = await participantsAPI.register(formPayload);
      if (response.success) {
        setFormData(prev => ({ ...prev, numero_dossier: response.data?.numero_dossier }));
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const stepsConfig = [
    { id: 1, title: "Identité", icon: <FaUser /> },
    { id: 2, title: "Église", icon: <FaChurch /> },
    { id: 3, title: "Urgence", icon: <FaPhoneAlt /> },
    { id: 4, title: "Santé", icon: <FaHeartbeat /> },
    { id: 5, title: "Paiement", icon: <FaCreditCard /> },
    { id: 6, title: "Validation", icon: <FaCheckCircle /> },
  ];

  const renderPaymentInstructions = () => {
    const details = {
      "Airtel Money": { phone: "099 901 1955", code: "*501#", color: "red" },
    };

    const inst = details[formData.mode_paiement];
    if (!inst) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mt-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <FaMobileAlt className="text-primary text-2xl animate-bounce" />
          <h4 className="font-bold text-secondary text-lg">Instructions {formData.mode_paiement}</h4>
        </div>
        <p className="text-gray-600 mb-4 text-sm">
          Veuillez effectuer un transfert de <strong className="text-secondary text-base">20 USD</strong> au numéro suivant :
          <br />
          <span className="block text-2xl font-black tracking-widest text-primary my-2">{inst.phone}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href={`tel:${inst.code}`}
            className="w-full text-center bg-secondary hover:bg-secondary-light text-white font-bold py-3 px-6 rounded-xl transition-all text-sm"
          >
            Composer {inst.code} pour payer
          </a>
          <span className="text-xs text-gray-400">ou scannez le reçu après transaction</span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f9fa] font-sans flex flex-col justify-between">
      <Navbar transparent={false} />

      <div className="max-w-4xl mx-auto px-4 py-28 w-full">
        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Progress Header */}
          <div className="bg-secondary px-6 md:px-10 py-8 text-white relative">
            <h1 className="text-2xl md:text-3xl font-black font-display mb-1">
              Inscription à la RELAC 2026
            </h1>
            <p className="text-white/60 text-xs md:text-sm">
              Remplissez les informations requises pour réserver votre badge officiel.
            </p>

            {/* Step Indicators */}
            <div className="flex justify-between items-center relative mt-8 pt-4">
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-white/10 z-0" />
              <div
                className="absolute left-0 top-5 h-0.5 bg-primary transition-all duration-500 z-0"
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              />

              {stepsConfig.map((s) => (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      step >= s.id
                        ? "bg-primary text-white shadow-glow"
                        : "bg-[#1f384f] text-white/40 border border-white/10"
                    }`}
                  >
                    {s.icon}
                  </div>
                  <span className={`text-[10px] font-bold tracking-wider uppercase hidden md:block ${step >= s.id ? "text-primary" : "text-white/40"}`}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Error */}
          {error && (
            <div className="mx-6 md:mx-10 mt-6 bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Form Content */}
          <div className="p-6 md:p-10 min-h-[400px]">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-5xl" />
                </div>
                <h2 className="text-3xl font-black text-secondary font-display mb-4">Félicitations !</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  Votre pré-inscription a été validée avec succès. Notez précieusement votre matricule ci-dessous.
                </p>
                <div className="bg-primary-light border border-primary/20 rounded-2xl p-6 max-w-sm mx-auto mb-8 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Votre Matricule</p>
                  <p className="text-3xl font-black text-primary font-display tracking-widest">
                    {formData.numero_dossier || "NON-GENERE"}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to={`/participant/${formData.numero_dossier}`}
                    className="btn-pill-primary px-8 py-3.5 text-sm font-bold"
                  >
                    Accéder à mon Portail
                  </Link>
                  <Link
                    to="/"
                    className="btn-pill-outline px-8 py-3.5 text-sm font-bold"
                  >
                    Retour à l'accueil
                  </Link>
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* STEP 1: IDENTITY */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-secondary font-display border-b pb-3">
                        Informations Personnelles
                      </h3>
                      
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        {/* Photo Upload */}
                        <div className="w-full md:w-1/3 flex flex-col items-center">
                          <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center group hover:border-primary transition-all">
                            {formData.photoPreview ? (
                              <img src={formData.photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-center p-4">
                                <FaCamera className="text-gray-400 text-3xl mx-auto mb-2" />
                                <span className="text-[10px] text-gray-400 font-bold block">Ajouter une Photo</span>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'photo')}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                          <span className="text-[10px] text-gray-400 mt-2 text-center">Format carré recommandé (max 5 Mo)</span>
                        </div>

                        {/* Fields */}
                        <div className="w-full md:w-2/3 grid grid-cols-2 gap-4">
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Prénom *</label>
                            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="input-field" placeholder="Ex: Jean" required />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Nom de famille *</label>
                            <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="input-field" placeholder="Ex: Kabila" required />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Postnom</label>
                            <input type="text" name="postnom" value={formData.postnom} onChange={handleChange} className="input-field" placeholder="Ex: Malu" />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Sexe *</label>
                            <select name="sexe" value={formData.sexe} onChange={handleChange} className="input-field">
                              <option value="">Sélectionner</option>
                              <option value="Masculin">Masculin</option>
                              <option value="Féminin">Féminin</option>
                            </select>
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Date de naissance *</label>
                            <input type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} className="input-field" required />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Téléphone *</label>
                          <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} className="input-field" placeholder="+243..." required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">WhatsApp</label>
                          <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="input-field" placeholder="+243..." />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Email</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="exemple@mail.com" />
                        </div>
                        <div className="col-span-1 md:col-span-3">
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Adresse de résidence</label>
                          <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} className="input-field" placeholder="Adresse complète..." />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: CHURCH */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-secondary font-display border-b pb-3">
                        Profil Ecclésiastique
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Église d'origine *</label>
                          <select
                            name="eglise"
                            value={formData.eglise}
                            onChange={handleChange}
                            className="input-field"
                            required
                          >
                            <option value="">— Sélectionner votre église —</option>
                            <optgroup label="Logos-Rhema Centres de Gloire — Lubumbashi">
                              <option value="Logos-Rhema Centre de Gloire Jubilé">Logos-Rhema Centre de Gloire Jubilé</option>
                              <option value="Logos-Rhema Centre de Gloire Shibah">Logos-Rhema Centre de Gloire Shibah</option>
                              <option value="Logos-Rhema Centre de Gloire Rehoboth">Logos-Rhema Centre de Gloire Rehoboth</option>
                              <option value="Logos-Rhema Centre de Gloire El-Beryth Kadosh (Malela)">Logos-Rhema Centre de Gloire El-Beryth Kadosh (Malela)</option>
                              <option value="Logos-Rhema Centre de Gloire (Ruashi)">Logos-Rhema Centre de Gloire (Ruashi)</option>
                            </optgroup>
                            <optgroup label="Logos-Rhema Centres de Gloire — Hors Lubumbashi">
                              <option value="Logos-Rhema Centre de Gloire Eben-Ezer (Likasi)">Logos-Rhema Centre de Gloire Eben-Ezer (Likasi)</option>
                              <option value="Logos-Rhema Centre de Gloire Hope (Kolwezi)">Logos-Rhema Centre de Gloire Hope (Kolwezi)</option>
                              <option value="Logos-Rhema Centre de Gloire El-Bethel (Kolwezi)">Logos-Rhema Centre de Gloire El-Bethel (Kolwezi)</option>
                            </optgroup>
                            <option value="Autres">Autres (préciser ci-dessous)</option>
                          </select>
                        </div>

                        {/* Champ conditionnel si "Autres" */}
                        {formData.eglise === "Autres" && (
                          <div className="col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">
                              Précisez le nom de votre église *
                            </label>
                            <input
                              type="text"
                              name="eglise_autre"
                              value={formData.eglise_autre || ""}
                              onChange={(e) => setFormData({ ...formData, eglise_autre: e.target.value })}
                              className="input-field border-primary"
                              placeholder="Ex: Église Évangélique de Kinshasa..."
                              required
                            />
                            <p className="text-xs text-primary mt-1">⚠️ Veuillez indiquer le nom exact de votre église.</p>
                          </div>
                        )}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Département ou Service</label>
                          <input type="text" name="departement" value={formData.departement} onChange={handleChange} className="input-field" placeholder="Ex: Chorale, Protocole" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Fonction / Rôle</label>
                          <input type="text" name="fonction" value={formData.fonction} onChange={handleChange} className="input-field" placeholder="Ex: Membre, Responsable" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Responsable Spirituel / Mentor</label>
                          <input type="text" name="responsable_spirituel" value={formData.responsable_spirituel} onChange={handleChange} className="input-field" placeholder="Ex: Pasteur Christian" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Déjà participé à la RELAC ? *</label>
                          <select name="deja_participe" value={formData.deja_participe} onChange={handleChange} className="input-field">
                            <option value="">Sélectionner</option>
                            <option value="true">Oui</option>
                            <option value="false">Non</option>
                          </select>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Comment avez-vous connu la RELAC ?</label>
                          <select name="comment_connu" value={formData.comment_connu} onChange={handleChange} className="input-field">
                            <option value="">Sélectionner</option>
                            <option value="Réseaux sociaux">Réseaux sociaux</option>
                            <option value="Bouche à oreille">Ami / Connaissance</option>
                            <option value="Annonce Eglise">Annonces à l'église</option>
                            <option value="Autre">Autre</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: EMERGENCY CONTACT */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-secondary font-display border-b pb-3">
                        Contact en cas d'urgence
                      </h3>
                      <p className="text-xs text-gray-400">
                        Indiquez une personne de confiance de votre entourage à contacter en cas de besoin ou de problème de santé.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Nom complet du contact d'urgence *</label>
                          <input type="text" name="urgence_nom" value={formData.urgence_nom} onChange={handleChange} className="input-field" placeholder="Ex: Marie Kabila" required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Lien de parenté *</label>
                          <input type="text" name="urgence_lien" value={formData.urgence_lien} onChange={handleChange} className="input-field" placeholder="Ex: Mère, Père, Oncle, Ami" required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Téléphone du contact *</label>
                          <input type="tel" name="urgence_telephone" value={formData.urgence_telephone} onChange={handleChange} className="input-field" placeholder="+243..." required />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: HEALTH CARD */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-secondary font-display border-b pb-3">
                        Fiche Médicale (Facultatif)
                      </h3>
                      <p className="text-xs text-gray-400">
                        Ces informations sont strictement confidentielles et réservées exclusivement à l'équipe médicale de la retraite pour assurer votre sécurité.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Maladie chronique / Suivi particulier</label>
                          <textarea name="maladie_chronique" value={formData.maladie_chronique} onChange={handleChange} className="input-field h-24" placeholder="Ex: Asthme, Diabète..."></textarea>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Allergies connues</label>
                          <textarea name="allergies" value={formData.allergies} onChange={handleChange} className="input-field h-24" placeholder="Ex: Pénicilline, arachides..."></textarea>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Restrictions alimentaires</label>
                          <textarea name="restrictions_alimentaires" value={formData.restrictions_alimentaires} onChange={handleChange} className="input-field h-24" placeholder="Ex: Végétarien, pas de porc..."></textarea>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Traitement médical en cours</label>
                          <textarea name="traitements_medicaux" value={formData.traitements_medicaux} onChange={handleChange} className="input-field h-24" placeholder="Détaillez les médicaments et posologies si nécessaire..."></textarea>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Informations complémentaires</label>
                          <textarea name="infos_medicales_complementaires" value={formData.infos_medicales_complementaires} onChange={handleChange} className="input-field h-20" placeholder="Autre détail médical important..."></textarea>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: PAYMENT */}
                  {step === 5 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-secondary font-display border-b pb-3">
                        Frais d'Inscription
                      </h3>

                      <div className="bg-gradient-to-r from-secondary to-[#1f3a52] text-white p-6 rounded-2xl flex items-center justify-between shadow-sm">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Montant Unique</span>
                          <span className="block text-4xl font-black font-display text-primary mt-1">20 USD</span>
                          <span className="text-[10px] text-white/60">Logement + nourriture inclus pour 7 jours</span>
                        </div>
                        <FaMoneyBillWave className="text-5xl text-primary/20" />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Mode de Paiement *</label>
                          <select name="mode_paiement" value={formData.mode_paiement} onChange={handleChange} className="input-field">
                            <option value="">Choisir la méthode</option>
                            <option value="Airtel Money">Airtel Money</option>
                            <option value="Cash">Cash (Auprès du comité)</option>
                          </select>
                        </div>

                        {formData.mode_paiement && renderPaymentInstructions()}

                        {formData.mode_paiement && formData.mode_paiement !== "Cash" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Numéro de transaction (ID) *</label>
                              <input type="text" name="reference_paiement" value={formData.reference_paiement} onChange={handleChange} className="input-field" placeholder="Ex: MP2607..." required />
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Preuve de paiement (Reçu)</label>
                              <div className="relative border border-dashed border-gray-300 rounded-xl bg-gray-50 p-4 flex flex-col items-center justify-center hover:bg-gray-100 transition-all">
                                {formData.preuvePreview ? (
                                  <img src={formData.preuvePreview} alt="Reçu" className="w-16 h-16 object-cover rounded-lg" />
                                ) : (
                                  <>
                                    <FaUpload className="text-gray-400 mb-1" />
                                    <span className="text-[10px] text-gray-400 font-bold">Sélectionner un fichier</span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  onChange={(e) => handleFileChange(e, 'preuve_paiement')}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 6: VALIDATION */}
                  {step === 6 && (
                    <div className="text-center py-8 space-y-6">
                      <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                        <FaCheckCircle className="text-4xl" />
                      </div>
                      <h3 className="text-2xl font-black text-secondary font-display">Dernière étape</h3>
                      <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                        Veuillez relire attentivement vos données avant d'envoyer. Une fois soumis, votre dossier sera en cours de vérification.
                      </p>
                      
                      <div className="bg-gray-50 rounded-2xl p-6 text-left max-w-md mx-auto border border-gray-200/60 space-y-3">
                        <p className="text-sm"><strong>Nom complet :</strong> {formData.prenom} {formData.nom}</p>
                        <p className="text-sm"><strong>Téléphone :</strong> {formData.telephone}</p>
                        <p className="text-sm"><strong>Église :</strong> {formData.eglise}</p>
                        <p className="text-sm"><strong>Mode de Paiement :</strong> {formData.mode_paiement}</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="btn-pill-primary w-full max-w-xs py-4 text-sm font-bold"
                      >
                        {loading ? "Traitement en cours..." : "Valider mon Inscription"}
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Footer Controls */}
          {!success && (
            <div className="bg-gray-50 px-6 md:px-10 py-6 border-t border-gray-100 flex justify-between items-center">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-secondary font-bold transition-all"
                >
                  <FaArrowLeft className="text-xs" /> Précédent
                </button>
              ) : (
                <Link
                  to="/"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-secondary font-bold transition-all"
                >
                  <FaArrowLeft className="text-xs" /> Accueil
                </Link>
              )}

              {step < totalSteps && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-pill-primary px-6 py-3 text-xs font-bold"
                >
                  Suivant <FaArrowRight className="text-xs ml-1" />
                </button>
              )}
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Inscription;
