import {
  FaBookOpen,
  FaUsers,
  FaCross,
  FaBullseye,
} from "react-icons/fa";
import AnimatedSection from "./AnimatedSection";
import SectionHeader from "./SectionHeader";

function Objectives() {
  const objectifs = [
    {
      icon: <FaCross />,
      title: "Croissance Spirituelle",
      description:
        "Approfondir sa relation avec Dieu à travers les enseignements, la prière et la méditation de la Parole.",
    },
    {
      icon: <FaBookOpen />,
      title: "Formation Biblique",
      description:
        "Recevoir des enseignements solides pour mieux comprendre et appliquer les principes bibliques.",
    },
    {
      icon: <FaUsers />,
      title: "Communion Fraternelle",
      description:
        "Créer des liens forts avec d'autres jeunes partageant la même foi et les mêmes valeurs.",
    },
    {
      icon: <FaBullseye />,
      title: "Développement Personnel",
      description:
        "Découvrir son potentiel, ses dons et sa mission au travers des ateliers et activités.",
    },
  ];

  return (
    <section id="objectifs" className="py-28 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="Nos objectifs"
          title="Pourquoi la RELAC ?"
          description="La Retraite du Libre Accès est conçue pour accompagner les jeunes dans leur marche avec Dieu et leur permettre de vivre une expérience spirituelle transformatrice."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {objectifs.map((objectif, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="feature-card group">
                <div className="feature-icon-box">
                  <span className="text-3xl">{objectif.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-secondary">
                  {objectif.title}
                </h3>
                <p className="text-gray-500 leading-7">
                  {objectif.description}
                </p>
                <div className="mt-5">
                  <span className="text-primary font-semibold text-sm group-hover:underline cursor-pointer">
                    En savoir plus →
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Objectives;
