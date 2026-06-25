import { motion } from "framer-motion";
import { Star } from "lucide-react";
import testimonialsData from "./TestimonialData";
import { assets } from "../assets/assets";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

const slideLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

const slideRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

const NewTestimonialSection = () => {
  return (
    <div className="relative bg-primary text-primary py-32 overflow-hidden">
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 
                      w-[1200px] h-[1200px] 
                      rounded-full 
                      bg-[radial-gradient(circle_at_top,var(--blob-color-1),transparent)]
                      blur-3xl 
                      opacity-70
                      pointer-events-none
                      animate-pulse-slow">
      </div>
      {/* BACKGROUND GLOW */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px]
                      bg-[radial-gradient(circle,var(--blob-color-1),transparent)]
                      blur-3xl opacity-60 -z-10"></div>

      {/* ================= TOP AREA ================= */}
      <motion.div
        className="text-center px-6 max-w-3xl mx-auto mb-20"
        initial="initial"
        whileInView="animate"
        viewport={{ amount: 0.2, once: false }}
        variants={fadeUp}
      >
        <h1 className="text-5xl font-bold text-gradient mb-4">
          Built for Teams That Move at Light Speed
        </h1>

        <p className="text-secondary text-lg leading-relaxed">
          TrackForge empowers teams to collaborate faster, stay aligned, and ship better.
        </p>
      </motion.div>

      {/* ================= IMAGE + HIGHLIGHTS ================= */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-14 px-10">

        {/* LEFT IMAGE (with parallax) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
           viewport={{ amount: 0.2, once: false }}
          className="relative group"
        >
          <div className="absolute -inset-4 bg-[radial-gradient(circle,var(--blob-color-2),transparent)]
                          blur-2xl opacity-60 group-hover:opacity-80 transition"></div>

          <motion.img
            src={assets.feedback}
            className="rounded-2xl w-[480px] shadow-[0_0_30px_var(--glow-shadow)]
                       border border-default"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* RIGHT HIGHLIGHTS — stagger cards */}
        <motion.div
          className="flex flex-col gap-6 max-w-lg"
          initial="initial"
          whileInView="animate"
           viewport={{ amount: 0.2, once: false }}
          variants={fadeUp}
        >
          {[
            "Ultra-fast project workflows",
            "Real-time team collaboration",
            "Smart automation that reduces workload",
            "Neon-sharp analytics & insights",
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="p-5 rounded-xl bg-card border border-default
                         shadow-[0_0_20px_var(--glow-shadow)]
                         hover:shadow-[0_0_30px_var(--glow-shadow)] hover:border-neon
                         transition flex gap-4 items-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
               viewport={{ amount: 0.2, once: false }}
            >
              <div className="h-4 w-4 rounded-full bg-gradient shadow-lg mt-2" />
              <p className="text-secondary text-lg">{item}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ================= TESTIMONIAL CAROUSEL ================= */}
      <div className="mt-28 relative px-10">

        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 
                        -translate-y-1/2 w-[700px] h-[700px]
                        bg-[radial-gradient(circle,var(--blob-color-1),transparent)]
                        blur-3xl opacity-40 -z-10"></div>

        {/* Carousel wrapper */}
        <motion.div
          className="flex gap-10 overflow-x-auto noScroll py-10"
          initial="initial"
          whileInView="animate"
          variants={fadeUp}
           viewport={{ amount: 0.2, once: false }}
          transition={{ duration: 0.7 }}
        >
          {testimonialsData.map((t, i) => (
            <motion.div
              key={i}
              className="min-w-[340px] max-w-[340px] rounded-2xl p-6 bg-card
                         border border-default shadow-[0_0_20px_var(--glow-shadow)]
                         hover:shadow-[0_0_30px_var(--glow-shadow)] hover:border-neon
                         hover:-translate-y-2 transition cursor-pointer"
              whileHover={{ scale: 1.04 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-full bg-gradient shadow-lg">
                  {t.icon}
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg">{t.username}</h3>
                  <p className="text-sm text-muted">{t.role}</p>
                </div>
              </div>

              {/* Feedback */}
              <p className="text-secondary italic mb-4">“{t.feedback}”</p>

              {/* Rating */}
              <div className="flex items-center mb-3">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s < t.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-500"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-muted">{t.explanation}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default NewTestimonialSection;
