import { motion } from "framer-motion";

const directions = {
  up: { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
};

function AnimatedSection({ children, direction = "up", delay = 0, className = "" }) {
  const variant = directions[direction] || directions.up;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: variant.hidden,
        visible: {
          ...variant.visible,
          transition: { duration: 0.7, ease: "easeOut", delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedSection;
