import React from "react";
import { Link } from "react-router-dom";
import { Rocket, LogIn, Users, UserPlus, Wrench } from "lucide-react";
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
      delayChildren: 0.3,
    },
  },
};

const staggerChild = {
  initial: { opacity: 0, y: 25, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const HeroSection = () => {
  return (
    <div className="max-w-7xl mx-auto relative">
      



      {/* ==================== HERO CARD ==================== */}
      <motion.div
        className="hero-glass p-8 sm:p-14"
        initial="initial"
        whileInView="animate"
         viewport={{ amount: 0.2, once: false }}
        variants={fadeUp}

      >
        {/* Heading */}

        {/* HERO BACKGROUND ARC */}


        <motion.h1
          className="text-primary text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight"
          variants={fadeUp}
        >
          Welcome to <span className="text-gradient-glow">TrackForge</span>
        </motion.h1>

        {/* Subheading */}
        <motion.h2
          className="text-secondary text-xl sm:text-2xl font-semibold mt-4"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
           viewport={{ amount: 0.2, once: true }}
        >
          🚀 <span className="text-gradient">TrackForge</span> — Simplicity Meets Speed
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-muted mt-6 text-lg max-w-3xl"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
           viewport={{ amount: 0.2, once: true }}
        >
          Say goodbye to scattered bug reports and slow workflows. TrackForge powers
          fast collaboration, efficient task resolution, and clear visibility —
          all inside a modern interface designed for teams that move fast.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          variants={fadeUp}
          transition={{ delay: 0.35 }}
           viewport={{ amount: 0.2, once: true }}
        >
          <Link
            to="/login"
            className="btn-gradient text-base font-semibold flex items-center justify-center gap-2"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="btn-outline-neon text-base font-semibold flex items-center justify-center gap-2"
          >
            Register Now
          </Link>
        </motion.div>
      </motion.div>

      {/* ==================== GETTING STARTED ==================== */}
      <motion.div
        className="mt-24 bg-secondary neon-border border-default rounded-2xl p-10 shadow-xl"
        initial="initial"
        whileInView="animate"
         viewport={{ amount: 0.2, once: false }}
        variants={fadeUp}
      >
        {/* Title */}
        <motion.h1
          className="text-primary text-center text-4xl sm:text-5xl font-bold"
          variants={fadeUp}
           viewport={{ amount: 0.2, once: false }}
        >
          Getting Started is Easy
        </motion.h1>

        <motion.p
          className="text-muted text-center mt-2 text-lg"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
           viewport={{ amount: 0.2, once: false }}
        >
          Follow these simple steps and you're all set.
        </motion.p>

        {/* Cards Grid */}
        <motion.div
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerParent}
           viewport={{ amount: 0.2, once: false }}
        >
          {[
            { icon: LogIn, label: "Login" },
            { icon: Rocket, label: "Create Project" },
            { icon: Users, label: "Create Team" },
            { icon: UserPlus, label: "Add Members" },
            { icon: Wrench, label: "Solve Problems" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                 viewport={{ amount: 0.2, once: false }}
                variants={staggerChild}
                className="glass p-8 rounded-2xl flex flex-col items-center gap-4 text-center 
                          hover:border-neon transition-all hover:scale-[1.03] hover:-translate-y-1"
              >
                <div className="p-3 rounded-full bg-gradient shadow-lg">
                  <Icon className="h-8 w-8 text-black" />
                </div>
                <p className="text-primary text-xl font-semibold">{item.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>


      

    </div>
  );
};

export default HeroSection;
