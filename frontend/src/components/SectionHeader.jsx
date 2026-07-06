import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

function SectionHeader({ eyebrow, title, description, center = true, light = false }) {
  return (
    <AnimatedSection>
      <div className={`mb-16 ${center ? "text-center" : ""}`}>
        {eyebrow && (
          <motion.p
            className={`section-eyebrow ${light ? "text-accent" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {eyebrow}
          </motion.p>
        )}
        <h2
          className={`text-4xl md:text-5xl font-bold mt-3 leading-tight ${light ? "text-white" : "text-secondary"}`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-5 text-lg max-w-3xl leading-relaxed ${center ? "mx-auto" : ""} ${light ? "text-white/80" : "text-gray-500"}`}
          >
            {description}
          </p>
        )}
      </div>
    </AnimatedSection>
  );
}

export default SectionHeader;
