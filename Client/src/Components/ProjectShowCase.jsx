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
              w-80 h-[380px] bg-[#111318] rounded-2xl border border-[#2d0a39]
              shadow-[0_0_25px_rgba(200,0,255,0.25)]
              hover:shadow-[0_0_55px_rgba(255,0,200,0.55)]
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
                text-white border-b border-[#2d0a39]
              "
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
             viewport={{ amount: 0.2, once: false }}
            >
              {project.title}
            </motion.h1>

            {/* IMAGE */}
            <div className="w-full h-[320px] p-3 bg-[#0D0F14]">
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
        className="
          pointer-events-none absolute left-0 top-0 h-full w-24
          bg-gradient-to-r from-[#0A0A0C] via-[#0A0A0C]/80 to-transparent
        "
      ></div>

      {/* Fade Shadows Right */}
      <div
        className="
          pointer-events-none absolute right-0 top-0 h-full w-24
          bg-gradient-to-l from-[#0A0A0C] via-[#0A0A0C]/80 to-transparent
        "
      ></div>
    </motion.div>
  );
};

export default ProjectShowcase;
