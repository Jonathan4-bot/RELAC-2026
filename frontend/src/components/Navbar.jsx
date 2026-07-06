import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Navbar({ transparent = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { label: "À propos", href: "#apropos" },
    { label: "Objectifs", href: "#objectifs" },
    { label: "Programme", href: "#programme" },
    { label: "Informations", href: "#infos" },
    { label: "FAQ", href: "#faq" },
  ];

  const isTransparent = transparent && isHome && !scrolled;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`transition-all duration-500 ${
          isTransparent ? "navbar-transparent" : "navbar-sticky"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* JELOR logo */}
            <img
              src="/src/assets/images/jelorlogo.jpeg"
              alt="JELOR Logo"
              className="h-9 w-9 object-contain rounded-lg"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            {/* Blinking dot separator */}
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
            {/* ReLAc logo */}
            <img
              src="/src/assets/images/relaclogo.png"
              alt="ReLAc Logo"
              className="h-9 w-9 object-contain rounded-lg"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div>
              <span
                className={`font-display font-black text-xl tracking-tight transition-colors duration-300 ${
                  isTransparent ? "text-white" : "text-secondary"
                } group-hover:text-primary`}
              >
                ReLAc <span className={isTransparent ? "text-primary" : "text-primary"}>2026</span>
              </span>
              <span
                className={`hidden sm:block text-xs font-medium ${
                  isTransparent ? "text-white/50" : "text-gray-400"
                }`}
              >
                Retraite du Libre Accès
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {isHome &&
              navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`nav-link-stocker font-display font-semibold text-sm transition-colors duration-300 ${
                    isTransparent
                      ? "text-white/80 hover:text-white"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            {!isHome && (
              <Link
                to="/"
                className={`nav-link-stocker font-display font-semibold text-sm ${
                  isTransparent ? "text-white/80" : "text-gray-600 hover:text-primary"
                }`}
              >
                Accueil
              </Link>
            )}

            <Link
              to="/portail"
              className={`nav-link-stocker font-display font-semibold text-sm ${
                isTransparent ? "text-white/80" : "text-gray-600 hover:text-primary"
              }`}
            >
              Mon Portail
            </Link>

            <Link
              to="/login"
              className={`nav-link-stocker font-display font-semibold text-sm ${
                isTransparent ? "text-white/80" : "text-gray-600 hover:text-primary"
              }`}
            >
              Administration
            </Link>

            <Link
              to="/inscription"
              className="btn-pill-primary px-7 py-2.5 text-sm"
            >
              Je m'inscris
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className={`lg:hidden w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isTransparent
                ? "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                : "bg-gray-100 text-secondary hover:bg-primary/10 hover:text-primary"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={menuOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden lg:hidden"
            >
              <div
                className={`px-6 py-6 space-y-1 ${
                  isTransparent
                    ? "bg-secondary/96 backdrop-blur-xl"
                    : "bg-white border-t border-gray-100"
                }`}
              >
                {isHome &&
                  navLinks.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 py-3.5 px-4 rounded-xl font-display font-semibold transition-all duration-200 ${
                        isTransparent
                          ? "text-white/80 hover:text-white hover:bg-white/10"
                          : "text-gray-700 hover:text-primary hover:bg-primary/5"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {link.label}
                    </motion.a>
                  ))}
                {!isHome && (
                  <Link
                    to="/"
                    className={`flex items-center gap-3 py-3.5 px-4 rounded-xl font-display font-semibold ${
                      isTransparent
                        ? "text-white/80 hover:bg-white/10"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Accueil
                  </Link>
                )}
                <Link
                  to="/portail"
                  className={`flex items-center gap-3 py-3.5 px-4 rounded-xl font-display font-semibold ${
                    isTransparent
                      ? "text-white/80 hover:bg-white/10"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Mon Portail
                </Link>
                <Link
                  to="/login"
                  className={`flex items-center gap-3 py-3.5 px-4 rounded-xl font-display font-semibold ${
                    isTransparent
                      ? "text-white/80 hover:bg-white/10"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Administration
                </Link>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="pt-3"
                >
                  <Link
                    to="/inscription"
                    className="block btn-pill-primary text-center py-3.5 w-full"
                    onClick={() => setMenuOpen(false)}
                  >
                    Je m'inscris maintenant
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

export default Navbar;
