import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

function Topbar() {
  const socials = [
    { icon: <FaFacebookF />, href: "#", label: "Facebook" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaYoutube />, href: "#", label: "YouTube" },
  ];

  return (
    <div className="hidden lg:block" style={{ background: "var(--secondary)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6 py-2.5">
        <div className="flex justify-between items-center">
          {/* Left — Contact info */}
          <div className="flex items-center gap-6 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
            <span className="flex items-center gap-1.5">
              <FaMapMarkerAlt style={{ color: "var(--primary)" }} className="text-xs" />
              École La Bonté 3, Lubumbashi
            </span>
            <a
              href="tel:+243997978888"
              className="flex items-center gap-1.5 transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.55)" }}
              onMouseOver={e => e.currentTarget.style.color = "var(--primary)"}
              onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
            >
              <FaPhoneAlt style={{ color: "var(--primary)" }} className="text-xs" />
              +243 997 978 888
            </a>
            <a
              href="mailto:contact@relac2026.org"
              className="flex items-center gap-1.5 transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.55)" }}
              onMouseOver={e => e.currentTarget.style.color = "var(--primary)"}
              onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
            >
              <FaEnvelope style={{ color: "var(--primary)" }} className="text-xs" />
              contact@relac2026.org
            </a>
          </div>

          {/* Right — Social + CTA */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)" }}
                  onMouseOver={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "white"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.12)" }} />
            <Link
              to="/inscription"
              className="text-xs font-display font-bold px-4 py-1.5 rounded-full transition-all duration-200"
              style={{ background: "var(--primary)", color: "white" }}
              onMouseOver={e => e.currentTarget.style.background = "var(--primary-dark)"}
              onMouseOut={e => e.currentTarget.style.background = "var(--primary)"}
            >
              ✦ Inscription ouverte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
