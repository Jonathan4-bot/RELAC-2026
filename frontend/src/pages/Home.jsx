import AnimatedSection from "../components/AnimatedSection.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import AboutRelac from "../components/AboutRelac";
import Objectives from "../components/Objectives";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaPrayingHands,
  FaUsers,
  FaLightbulb,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCreditCard,
  FaBed,
  FaStar,
  FaChevronDown,
  FaCross,
  FaChevronLeft,
  FaChevronRight,
  FaFire,
  FaWater,
  FaHandsHelping,
  FaBullseye,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Import real images from assets
import relac1 from "../assets/images/relac-1.jpeg";
import relac2 from "../assets/images/relac-2.jpeg";
import relac3 from "../assets/images/relac-3.jpeg";
import relac4 from "../assets/images/relac-4.jpeg";

const slides = [
  { img: relac1, icon: <FaCross />, label: "Louange & Adoration" },
  { img: relac2, icon: <FaPrayingHands />, label: "Moments de Prière" },
  { img: relac3, icon: <FaUsers />, label: "Communion Fraternelle" },
  { img: relac4, icon: <FaBookOpen />, label: "Enseignements & Révélation" },
];

const textSlides = [
  {
    title: "Vivez une transformation spirituelle unique",
    content: "La Retraite du Libre Accès (ReLAc) est un rendez-vous annuel divin conçu pour équiper, édifier et propulser la jeunesse dans son appel.",
    color: "text-white"
  },
  {
    title: "« Un Flot en Appelle un Autre »",
    content: "Psaumes 42:8 — Rejoignez des centaines de jeunes appelés à devenir les porteurs du prochain mouvement de Dieu dans cette génération.",
    color: "text-accent"
  },
  {
    title: "Des enseignements percutants",
    content: "Des sessions inspirées pour éveiller la jeunesse à discerner les temps et les saisons de Dieu et à porter Son flot avec consécration.",
    color: "text-white"
  }
];

function Home() {
  const targetDate = new Date("2026-08-09T00:00:00");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [openFaq, setOpenFaq] = useState(0);
  const [currentTextSlide, setCurrentTextSlide] = useState(0);

  // Auto slide texts
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTextSlide((prev) => (prev + 1) % textSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    const calculateTime = () => {
      const difference = targetDate - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const programme = [
    {
      title: "Enseignements",
      desc: "Des sessions théologiques et pratiques approfondies animées par des serviteurs de Dieu oints pour révéler le prochain flot.",
      icon: <FaBookOpen />,
    },
    {
      title: "Ateliers & Culte IDEE",
      desc: "Des temps interactifs d'échange sur le leadership, la consécration et la transmission générationnelle.",
      icon: <FaLightbulb />,
    },
    {
      title: "Adoration & Louange",
      desc: "Des moments intenses de célébration et de contemplation dans la présence divine pour devenir des porteurs du flot.",
      icon: <FaPrayingHands />,
    },
    {
      title: "Prières & Veillées",
      desc: "Des temps forts d'intercession, d'impartation et de consécration — car le feu brûlera sans cesse.",
      icon: <FaFire />,
    },
  ];

  const infos = [
    {
      icon: <FaCalendarAlt className="text-2xl" />,
      title: "Dates",
      desc: "Du 09 au 15 août 2026",
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      title: "Lieu",
      desc: "École La Bonté 3, Avenue des Aviateurs, Quartier Texaco — Lubumbashi",
    },
    {
      icon: <FaCreditCard className="text-2xl" />,
      title: "Participation",
      desc: "20 USD (Hébergement & Restauration inclus)",
    },
    {
      icon: <FaBed className="text-2xl" />,
      title: "À prévoir",
      desc: "Effets personnels, Bible, bloc-notes, nécessaire de toilette",
    },
  ];

  const faqs = [
    {
      q: "Qui peut s'inscrire à la ReLAc ?",
      a: "La retraite est ouverte à tous les jeunes désireux d'approfondir leur foi chrétienne, de vivre une transformation et de partager une communion authentique.",
    },
    {
      q: "Comment valider mon paiement ?",
      a: "Une fois le formulaire en ligne rempli, vous pouvez payer par Orange Money, Airtel Money, M-Pesa ou directement en espèces. Veuillez téléverser votre reçu ou capture d'écran sur votre portail participant.",
    },
    {
      q: "Qu'est-ce qui est inclus dans les 20 USD ?",
      a: "Les frais de participation couvrent l'accès complet à tous les enseignements et ateliers, le logement pour la semaine entière, ainsi que la restauration quotidienne.",
    },
    {
      q: "Puis-je arriver en retard ou partir avant la fin ?",
      a: "Pour bénéficier pleinement de l'impact spirituel de la retraite, nous recommandons fortement d'être présent du début à la fin (du 9 au 15 août).",
    },
    {
      q: "Quel est le thème de la ReLAc 2026 ?",
      a: "Le thème de cette édition est « Un Flot en Appelle un Autre » (Psaumes 42:8). Dieu appelle cette génération à discerner les temps, à porter Son mouvement avec consécration et à devenir le prochain flot du Royaume.",
    },
  ];

  const stats = [
    { value: "12e", label: "Édition Annuelle" },
    { value: "100+", label: "Participants Attendus" },
    { value: "7 Jours", label: "Mise à Part" },
    { value: "20$", label: "Frais de Participation" },
  ];

  // Theme pillars from the Vision document
  const themePillars = [
    {
      icon: <FaWater />,
      title: "Discerner les Temps",
      desc: "Chaque génération est appelée à reconnaître les saisons de Dieu. Le silence d'une saison ne signifie pas l'absence de Dieu.",
      verse: "Psaumes 42:8",
    },
    {
      icon: <FaHandsHelping />,
      title: "Porteurs du Flot",
      desc: "Dieu cherche toujours des vases disponibles. Moïse est parti, Josué a porté le flot suivant. Chaque génération reçoit ce mandat.",
      verse: "Josué 1:1-2",
    },
    {
      icon: <FaFire />,
      title: "Feu & Consécration",
      desc: "Les grandes visitations reposent sur des vies consacrées. La profondeur du flot dépend de la profondeur de la consécration.",
      verse: "2 Rois 2:9-15",
    },
    {
      icon: <FaBullseye />,
      title: "Transmission",
      desc: "Un flot en appelle toujours un autre. Paul a transmis à Timothée. Cette génération doit recevoir et transmettre le mandat.",
      verse: "2 Timothée 2:2",
    },
  ];

  const nextSlide = () => {
    setSlideDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setSlideDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="font-sans overflow-x-hidden bg-[#fafafa]">
      {/* ========== NAVBAR ========== */}
      <Navbar transparent />

      {/* ========== HERO SECTION (FULL WIDTH DESIGN) ========== */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-secondary to-[#18364e] px-6 py-32 overflow-hidden text-center">
        {/* Soft decorative glow circles */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full filter blur-[120px] pointer-events-none" />
        
        {/* Subtle grid overlay for premium aesthetic */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Logos JELOR + ReLAc */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/10">
              {/* JELOR Logo */}
              <img
                src="/src/assets/images/jelorlogo.jpeg"
                alt="JELOR Logo"
                className="h-10 w-10 object-contain rounded-lg animate-float"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              {/* Blinking dot separator */}
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              {/* ReLAc Logo */}
              <img
                src="/src/assets/images/relaclogo.png"
                alt="ReLAc Logo"
                className="h-10 w-10 object-contain rounded-lg animate-float"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div className="w-px h-6 bg-white/10" />
              <div className="text-left">
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">JELOR</p>
                <p className="text-white font-display font-bold text-xs tracking-wide">Jeunesse Logos-Rhema</p>
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex flex-col items-center"
          >
            <span className="section-eyebrow text-accent font-bold mb-4">12ème Édition</span>
            <h1 className="text-4xl md:text-6xl font-black !text-white leading-tight mb-5 font-display max-w-3xl" style={{ color: '#ffffff' }}>
              Retraite du Libre Accès <br />
              <span className="text-amber-400 drop-shadow-md">ReLAc 2026</span>
            </h1>
            
            {/* Theme badge */}
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-5 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
              <span className="text-accent text-xs md:text-sm font-bold tracking-wide">« Un Flot en Appelle un Autre » — Ps 42:8</span>
            </div>
            
            <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
              Une semaine exceptionnelle de mise à part dans la présence de Dieu. Venez porter le prochain flot du Royaume avec consécration et puissance.
            </p>
          </motion.div>

          {/* Animated Text Slides Banner (Glass card style) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-2xl mb-10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTextSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl"
              >
                <h3 className="text-lg md:text-xl font-bold text-accent mb-2 font-display">
                  {textSlides[currentTextSlide].title}
                </h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  {textSlides[currentTextSlide].content}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Countdown Clock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-4 gap-4 md:gap-6 mb-12 bg-white/5 p-5 md:p-6 rounded-3xl border border-white/10 backdrop-blur-md relative max-w-md w-full"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-secondary text-[10px] font-black tracking-widest uppercase rounded-full">
              Commence dans
            </div>
            {[
              { val: timeLeft.days, label: "Jours" },
              { val: timeLeft.hours, label: "Heures" },
              { val: timeLeft.minutes, label: "Min" },
              { val: timeLeft.seconds, label: "Sec" },
            ].map((unit, i) => (
              <div key={i} className="text-center">
                <span className="block text-3xl md:text-4xl font-black text-white font-display">
                  {String(unit.val).padStart(2, "0")}
                </span>
                <span className="text-[10px] md:text-xs uppercase text-white/50 font-bold tracking-wider">
                  {unit.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/inscription"
              className="btn-pill-primary px-10 py-4 text-base font-bold shadow-glow hover:scale-105 active:scale-95"
            >
              <span>S'INSCRIRE MAINTENANT</span>
            </Link>
            <a
              href="#apropos"
              className="btn-pill-light px-10 py-4 text-base font-bold text-center border-white/20 hover:border-white/50"
            >
              En savoir plus
            </a>
          </motion.div>
        </div>
      </section>

      {/* ========== STATS STRIP ========== */}
      <section className="bg-secondary border-y border-white/5 py-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center border-r last:border-0 border-white/10 px-4">
                <span className="block text-3xl md:text-4xl font-black text-primary font-display mb-1">
                  {stat.value}
                </span>
                <span className="text-xs text-white/60 uppercase tracking-widest font-bold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl pointer-events-none" />
      </section>

      {/* ========== COMPOSANT A PROPOS (REFACTORED) ========== */}
      <AboutRelac />

      {/* ========== THEME SECTION ========== */}
      <section className="py-28 bg-secondary text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Central theme declaration */}
          <div className="text-center mb-20">
            <span className="section-eyebrow text-accent font-bold mb-4">Thème 2026</span>
            <h2 className="text-4xl md:text-6xl font-black !text-white mt-4 mb-4 font-display leading-tight" style={{ color: '#ffffff' }}>
              « Un Flot en Appelle<br />
              <span className="text-accent">un Autre »</span>
            </h2>
            <p className="text-white/60 text-base md:text-lg font-display italic mb-2">Psaumes 42:8</p>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mt-6">
              ReLAc 2026 est un appel prophétique. Dieu appelle cette génération à se lever, à discerner les temps et à comprendre qu'un nouveau flot est déjà en mouvement. Lorsque certains voient une fin, Dieu voit un commencement.
            </p>
          </div>

          {/* Theme pillars */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {themePillars.map((pillar, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.12}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 group h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center text-xl mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {pillar.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 font-display">{pillar.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{pillar.desc}</p>
                  <span className="text-xs text-accent font-bold italic">{pillar.verse}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Powerful quote */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-primary/10 border border-primary/20 rounded-2xl px-8 py-6 max-w-3xl">
              <p className="text-white text-lg md:text-xl font-display font-semibold leading-relaxed italic">
                « Le plus grand danger n'est pas qu'un flot s'éteigne. Le plus grand danger est qu'aucune génération ne se lève pour porter le suivant. »
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />
      </section>

      {/* ========== COMPOSANT OBJECTIFS (REFACTORED) ========== */}
      <Objectives />

      {/* ========== PROGRAMME SECTION ========== */}
      <section id="programme" className="py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            eyebrow="Programme clé"
            title="Une semaine de percée"
            description="Chaque jour est planifié pour favoriser une rencontre intime et personnelle avec le Seigneur à travers diverses activités."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programme.map((item, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.15}>
                <div className="bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2.5 hover:border-primary/20 transition-all duration-400 group overflow-hidden h-full">
                  <div className="flex items-center justify-center h-40 bg-gray-50 group-hover:bg-primary/5 transition-colors duration-300">
                    <span className="text-primary text-5xl transform group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100">
                      {item.icon}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-secondary mb-3 font-display">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== INFOS PRATIQUES SECTION ========== */}
      <section id="infos" className="py-28 bg-[#f5f8fa] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            eyebrow="Se préparer"
            title="Informations importantes"
            description="Voici les détails logistiques essentiels pour planifier sereinement votre séjour à la retraite."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {infos.map((item, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.1}>
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-lg text-secondary mb-2 font-display">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CALL TO ACTION BANNER ========== */}
      <section className="cta-banner py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 font-display leading-tight">
              Devenez le Prochain Flot
            </h2>
            <p className="text-white/70 text-base md:text-lg mb-10 max-w-2xl mx-auto">
              Vous n'êtes pas spectateurs du réveil. Vous êtes les porteurs du prochain mouvement. Réservez votre place dès aujourd'hui — ReLAc 2026 est une convocation prophétique.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/inscription" className="btn-pill-primary px-10 py-4 text-base font-bold shadow-glow">
                S'inscrire maintenant
              </Link>
              <a href="#infos" className="btn-pill-light px-10 py-4 text-base font-bold">
                Infos pratiques
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section id="faq" className="py-28 bg-[#f5f8fa] border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeader
            eyebrow="FAQ"
            title="Questions fréquentes"
            description="Toutes les réponses à vos interrogations logistiques et d'organisation."
          />

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.08}>
                <div className={`faq-item ${openFaq === idx ? "open" : ""}`}>
                  <button
                    type="button"
                    className="w-full flex justify-between items-center p-6 text-left"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  >
                    <h3 className="font-bold text-secondary font-display text-base md:text-lg">{faq.q}</h3>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 transition-all ${openFaq === idx ? "bg-primary text-white rotate-180" : "text-gray-500"}`}>
                      <FaChevronDown className="text-xs" />
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === idx ? "auto" : 0, opacity: openFaq === idx ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-gray-500 text-sm leading-relaxed border-t border-gray-100/50 pt-4">{faq.a}</p>
                  </motion.div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  );
}

export default Home;