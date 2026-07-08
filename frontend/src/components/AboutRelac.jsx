import {
  FaBookOpen,
  FaUsers,
  FaBullseye,
  FaHandsHelping,
  FaPhoneAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";

// Import real images from assets to showcase the event
import relac1 from "../assets/images/relac-1.jpeg";
import relac2 from "../assets/images/relac-2.jpeg";
import relac3 from "../assets/images/relac-3.jpeg";
import relac4 from "../assets/images/relac-4.jpeg";

// Import 25 new gallery images
import g1 from "../assets/images/relac_gallery_1.jpeg";
import g2 from "../assets/images/relac_gallery_2.jpeg";
import g3 from "../assets/images/relac_gallery_3.jpeg";
import g4 from "../assets/images/relac_gallery_4.jpeg";
import g5 from "../assets/images/relac_gallery_5.jpeg";
import g6 from "../assets/images/relac_gallery_6.jpeg";
import g7 from "../assets/images/relac_gallery_7.jpeg";
import g8 from "../assets/images/relac_gallery_8.jpeg";
import g9 from "../assets/images/relac_gallery_9.jpeg";
import g10 from "../assets/images/relac_gallery_10.jpeg";
import g11 from "../assets/images/relac_gallery_11.jpeg";
import g12 from "../assets/images/relac_gallery_12.jpeg";
import g13 from "../assets/images/relac_gallery_13.jpeg";
import g14 from "../assets/images/relac_gallery_14.jpeg";
import g15 from "../assets/images/relac_gallery_15.jpeg";
import g16 from "../assets/images/relac_gallery_16.jpeg";
import g17 from "../assets/images/relac_gallery_17.jpeg";
import g18 from "../assets/images/relac_gallery_18.jpeg";
import g19 from "../assets/images/relac_gallery_19.jpeg";
import g20 from "../assets/images/relac_gallery_20.jpeg";
import g21 from "../assets/images/relac_gallery_21.jpeg";
import g22 from "../assets/images/relac_gallery_22.jpeg";
import g23 from "../assets/images/relac_gallery_23.jpeg";
import g24 from "../assets/images/relac_gallery_24.jpeg";
import g25 from "../assets/images/relac_gallery_25.jpeg";

const collageItems = [
  { img: relac1, label: "Enseignements & Révélation" },
  { img: relac2, label: "Moments de Prière" },
  { img: relac3, label: "Communion Fraternelle" },
  { img: relac4, label: "Louange & Adoration" },
  { img: g1, label: "Retraite ReLAc — Édition Spéciale" },
  { img: g2, label: "Jeunesse JELOR — Porteurs de Flot" },
  { img: g3, label: "Temps d'Adoration Intense" },
  { img: g4, label: "Enseignements Bibliques" },
  { img: g5, label: "Communion et Partage" },
  { img: g6, label: "Moments forts de Célébration" },
  { img: g7, label: "Prière d'Impartation" },
  { img: g8, label: "Consécration de la Jeunesse" },
  { img: g9, label: "Retraite ReLAc — Une semaine de gloire" },
  { img: g10, label: "Ateliers et Culte IDEE" },
  { img: g11, label: "Une génération qui se lève" },
  { img: g12, label: "Gloire dans la présence de Dieu" },
  { img: g13, label: "Enseignements & Leadership" },
  { img: g14, label: "Adoration et Reconnaissance" },
  { img: g15, label: "Rencontre personnelle avec Dieu" },
  { img: g16, label: "Une ferveur spirituelle contagieuse" },
  { img: g17, label: "Logos-Rhema en Action" },
  { img: g18, label: "Mise à part pour le Seigneur" },
  { img: g19, label: "Veillée d'intercession" },
  { img: g20, label: "À l'écoute de la Parole" },
  { img: g21, label: "Moments fraternels inoubliables" },
  { img: g22, label: "La joie du salut partagée" },
  { img: g23, label: "Bâtir pour l'éternité" },
  { img: g24, label: "Des vies transformées" },
  { img: g25, label: "Prêts pour le prochain flot" },
];

function AboutRelac() {
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImage((prev) => (prev === collageItems.length - 1 ? 0 : prev + 1));
        setFade(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: <FaBookOpen />, text: "Enseignements" },
    { icon: <FaHandsHelping />, text: "Prières" },
    { icon: <FaUsers />, text: "Communion" },
    { icon: <FaBullseye />, text: "Ateliers" },
  ];

  return (
    <section id="apropos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image collage of the actual retreat */}
          <AnimatedSection direction="left">
            <div className="relative">
              {/* Main image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={collageItems[currentImage].img}
                  alt={collageItems[currentImage].label}
                  className={`w-full h-[500px] lg:h-[560px] object-cover transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"} animate-slow-zoom`}
                />
                {/* Floating label */}
                <div className="absolute bottom-4 left-4 bg-secondary/80 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-semibold uppercase tracking-wider">
                  {collageItems[currentImage].label}
                </div>
              </div>

              {/* Floating accent images */}
              <div className="absolute -top-4 -right-4 w-28 h-28 rounded-xl overflow-hidden shadow-xl animate-float hidden md:block border-2 border-white">
                <img
                  src={relac3}
                  alt="Communion"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-36 rounded-xl overflow-hidden shadow-xl hidden md:block border-2 border-white" style={{ transform: "rotate(-6deg)" }}>
                <img
                  src={relac4}
                  alt="Louange et Adoration"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Call card */}
              <div className="absolute bottom-8 right-8 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-4 animate-pulse-glow hidden lg:flex">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaPhoneAlt className="text-primary text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Appelez-nous</p>
                  <p className="font-bold text-secondary tracking-wide">+243 997 978 888</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Text */}
          <AnimatedSection direction="right">
            <p className="section-eyebrow">À propos de nous</p>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 text-secondary leading-tight">
              Qu'est-ce que la ReLAc ?
            </h2>
            <p className="mt-6 text-gray-500 leading-8 text-lg">
              La Retraite du Libre Accès (ReLAc) est l'événement phare organisé by la Jeunesse Logos-Rhema (JELOR) des Ministères Chrétiens Logos-Rhema.
              Cette rencontre spirituelle, dont nous célébrons la douzième édition, marque un temps exceptionnel de mise à part, de prière, d'adoration et de renforcement des capacités.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {features.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl hover:bg-primary/5 hover:border-primary/20 border-2 border-transparent transition-all duration-300 group cursor-default"
                >
                  <div className="text-primary text-xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className="font-medium text-secondary">{item.text}</span>
                </div>
              ))}
            </div>

            <a href="#programme" className="btn-pill-primary inline-block mt-8 px-8 py-3.5">
              Découvrir le programme
            </a>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

export default AboutRelac;
