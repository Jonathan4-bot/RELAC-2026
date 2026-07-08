import { Link } from "react-router-dom";
import {
  FaFacebookF, FaInstagram, FaYoutube, FaMapMarkerAlt,
  FaPhoneAlt, FaEnvelope, FaAngleRight, FaHeart,
} from "react-icons/fa";
import AnimatedSection from "./AnimatedSection";
import jelorLogo from "../assets/images/jelorlogo.jpeg";
import relacLogo from "../assets/images/relaclogo.png";
function Footer() {
  const quickLinks = [
    { label: "À propos", href: "#apropos" },
    { label: "Objectifs", href: "#objectifs" },
    { label: "Programme", href: "#programme" },
    { label: "Informations", href: "#infos" },
    { label: "FAQ", href: "#faq" },
    { label: "Inscription", href: "/inscription", isRoute: true },
  ];

  const programme = [
    "Enseignements bibliques",
    "Ateliers pratiques",
    "Louange & Adoration",
    "Veillées de prière",
    "Communion fraternelle",
    "Leadership chrétien",
  ];

  const socials = [
    { icon: <FaFacebookF />, href: "https://www.facebook.com/share/1EX1FwMnda/?mibextid=wwXIfr", label: "Facebook" },
    { icon: <FaInstagram />, href: "https://www.instagram.com/jeunesse_logos_rhema_katanga?utm_source=qr", label: "Instagram" },
    { icon: <FaYoutube />, href: "https://youtube.com/@jeunesselogosrhemalubumbashi?si=sh1HqI3utL0W1Rid", label: "YouTube" },
  ];

  return (
    <footer className="site-footer">
      {/* Top gradient divider */}
      <div
        style={{
          height: "3px",
          background: "linear-gradient(90deg, var(--primary), var(--accent), var(--primary))",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-5 group">
                {/* JELOR Logo */}
                <img
                  src={jelorLogo}
                  alt="JELOR Logo"
                  className="h-11 w-11 object-contain rounded-xl"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                {/* Blinking dot separator */}
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                {/* ReLAc Logo */}
                <img
                  src={relacLogo}
                  alt="ReLAc Logo"
                  className="h-11 w-11 object-contain rounded-xl"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <div>
                  <p className="font-display font-black text-xl text-white leading-tight">ReLAc 2026</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Jeunesse Logos-Rhema</p>
                </div>
              </Link>
              <p className="text-sm leading-7" style={{ color: "rgba(255,255,255,0.55)" }}>
                La Retraite du Libre Accès — 12ème édition. Une semaine de transformation spirituelle et de communion fraternelle.
              </p>
              {/* Social */}
              <div className="flex gap-3 mt-6">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
                    onMouseOver={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "white"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h5 className="font-display font-bold text-base mb-5 text-white">Liens rapides</h5>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    {link.isRoute ? (
                      <Link
                        to={link.href}
                        className="flex items-center gap-2 text-sm transition-colors duration-200"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                        onMouseOver={e => e.currentTarget.style.color = "var(--primary)"}
                        onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                      >
                        <FaAngleRight style={{ color: "var(--primary)" }} className="text-xs shrink-0" />
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="flex items-center gap-2 text-sm transition-colors duration-200"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                        onMouseOver={e => e.currentTarget.style.color = "var(--primary)"}
                        onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                      >
                        <FaAngleRight style={{ color: "var(--primary)" }} className="text-xs shrink-0" />
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Programme */}
            <div>
              <h5 className="font-display font-bold text-base mb-5 text-white">Le programme</h5>
              <ul className="space-y-2.5">
                {programme.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "var(--primary)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h5 className="font-display font-bold text-base mb-5 text-white">Contact</h5>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <FaMapMarkerAlt style={{ color: "var(--primary)" }} className="mt-0.5 shrink-0" />
                  <span>École La Bonté 3<br />Av. des Aviateurs, Q. Texaco<br />Lubumbashi, RDC</span>
                </li>
                <li>
                  <a
                    href="tel:+243997978888"
                    className="flex items-center gap-3 text-sm transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                    onMouseOver={e => e.currentTarget.style.color = "var(--primary)"}
                    onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                  >
                    <FaPhoneAlt style={{ color: "var(--primary)" }} className="shrink-0" />
                    +243 997 978 888
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@relac2026.org"
                    className="flex items-center gap-3 text-sm transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                    onMouseOver={e => e.currentTarget.style.color = "var(--primary)"}
                    onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                  >
                    <FaEnvelope style={{ color: "var(--primary)" }} className="shrink-0" />
                    jonathanlubaki7@gmail.com
                  </a>
                </li>
              </ul>

              {/* CTA box */}
              <div
                className="mt-6 rounded-xl p-4"
                style={{ background: "rgba(0, 208, 132, 0.08)", border: "1px solid rgba(0, 208, 132, 0.2)" }}
              >
                <p className="text-xs mb-3 font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                  📅 Du 09 au 15 août 2026
                </p>
                <Link
                  to="/inscription"
                  className="block text-center text-sm font-display font-bold py-2.5 rounded-full transition-all duration-300"
                  style={{ background: "var(--primary)", color: "white" }}
                  onMouseOver={e => e.currentTarget.style.background = "var(--primary-dark)"}
                  onMouseOut={e => e.currentTarget.style.background = "var(--primary)"}
                >
                  S'inscrire maintenant
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              © 2026 ReLAc — Jeunesse Logos-Rhema. Tous droits réservés.
            </p>
            <p className="text-xs flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              12ème Édition • Conçu avec <FaHeart className="text-red-400 text-xs" /> pour la gloire de Dieu
            </p>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
}

export default Footer;
