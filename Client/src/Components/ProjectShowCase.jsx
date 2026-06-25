import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const projects = [
  { title: "E-Commerce Redesign", image: assets.project2 },
  { title: "Mobile Bug Tracker", image: assets.project4 },
  { title: "AI Analytics Dashboard", image: assets.project3 },
  { title: "Team Wiki System", image: assets.project4 },
  { title: "Real-time Chat", image: assets.project4 },
];

const ProjectShowcase = () => {
  return (
    <motion.div
      className="relative w-full py-16 overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
     viewport={{ amount: 0.2, once: false }}
    >
      {/* Auto-scrolling horizontal gallery */}
      <motion.div
        className="flex w-max gap-10 animate-scroll-gallery px-4"
        initial={{ x: 40 }}
        whileInView={{ x: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ amount: 0.2, once: false }}
      >
        {[...projects, ...projects].map((project, index) => (
          <motion.div
            key={index}
            className="
              w-80 h-[380px] bg-card rounded-2xl border border-default
              shadow-[0_0_20px_var(--glow-shadow)]
              hover:shadow-[0_0_30px_var(--glow-shadow)] hover:border-neon
              hover:-translate-y-2 hover:scale-[1.03] transition-all duration-300 
              overflow-hidden flex-shrink-0 cursor-pointer group
            "
            whileHover={{ scale: 1.05 }}
          >
            {/* TITLE */}
            <motion.h1
              className="
                text-center py-3 text-xl font-semibold 
                bg-gradient-to-r from-purple-500 to-pink-600 
                text-white border-b border-default
              "
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
             viewport={{ amount: 0.2, once: false }}
            >
              {project.title}
            </motion.h1>

            {/* IMAGE */}
            <div className="w-full h-[320px] p-3 bg-secondary">
              <motion.img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover rounded-lg"
                initial={{ opacity: 0, scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                 viewport={{ amount: 0.2, once: false }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Fade Shadows Left */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-24"
        style={{
          background: `linear-gradient(to right, var(--bg-primary) 0%, var(--bg-primary) 50%, transparent 100%)`
        }}
      ></div>

      {/* Fade Shadows Right */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-24"
        style={{
          background: `linear-gradient(to left, var(--bg-primary) 0%, var(--bg-primary) 50%, transparent 100%)`
        }}
      ></div>
    </motion.div>
  );
};

export default ProjectShowcase;
