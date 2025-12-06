import { RefreshCw, Target, Workflow } from "lucide-react";
import { FiBell } from "react-icons/fi";
import React from "react";
import { motion } from "framer-motion";

// GLOBAL MOTION PRESETS
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1],
  },
};

const staggerParent = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const staggerChild = {
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
};

const WhySection = () => {
  return (
    <div className="py-28 mt-10 relative overflow-hidden">

      

      {/* BACKGROUND BLOBS */}
      <div className="hero-blob blob-1"></div>
      <div className="hero-blob blob-2"></div>

      {/* ========================= HEADING ========================= */}
      <motion.div
        className="text-center mb-14"
        initial="initial"
        whileInView="animate"
       viewport={{ amount: 0.2, once: false }}
        variants={fadeUp}
      >
        <h1 className="text-gradient h-18 text-5xl md:text-6xl font-extrabold">
          Why Are We Here?
        </h1>
        <p className="text-muted mt-3 text-lg max-w-2xl mx-auto">
          TrackForge exists to make team collaboration easier, smarter, and faster.
        </p>
      </motion.div>

      {/* ========================= FEATURE CARDS ========================= */}
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
        initial="initial"
        whileInView="animate"
 viewport={{ amount: 0.2, once: false }}
        variants={staggerParent}
      >
        {[
          {
            title: "Streamline Team Workflow",
            desc: "Assign, track, and resolve issues effortlessly with a centralized workspace.",
            icon: Workflow,
          },
          {
            title: "Stay Ahead with Real-Time Updates",
            desc: "Receive instant alerts on comments, status changes, and important activity.",
            icon: FiBell,
          },
          {
            title: "Prioritize What Matters",
            desc: "Use custom tags and filters to stay aligned with high-impact work.",
            icon: Target,
          },
          {
            title: "Adapt with Confidence",
            desc: "Reschedule, reorganize, and stay agile—without losing clarity.",
            icon: RefreshCw,
          },
        ].map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
               viewport={{ amount: 0.2, once: false }}
              variants={staggerChild}
              className="glass p-8 rounded-2xl flex flex-col items-start gap-4 
                         transition-all shadow-lg hover:scale-[1.03] hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="p-3 bg-gradient rounded-full shadow-xl">
                <Icon className="text-black h-7 w-7" />
              </div>

              {/* Title */}
              <h3 className="text-primary text-xl font-semibold leading-snug">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-secondary text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default WhySection;
