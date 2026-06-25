import React from "react";
import { FiFolder, FiTool, FiTrendingUp } from "react-icons/fi";
import { FeatureSection } from "./FeatureSection";
import { Rocket, Telescope } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectShowcase from "./ProjectShowCase";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

// Motion Presets
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

const fadeDown = {
  initial: { opacity: 0, y: -40 },
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

const ProjectSection = () => {
  return (
    <div className="relative bg-primary text-primary">

      {/* BACKGROUND GLOW */}
      <div
        className="absolute top-40 right-1/4 w-[600px] h-[600px] rounded-full
                    bg-[radial-gradient(circle,var(--blob-color-1),transparent)]
                    blur-3xl opacity-60 -z-10"
      ></div>

      {/* ================= SECTION 1 ================= */}
      <div className="py-20 flex items-center justify-center gap-16 flex-wrap px-6">

        {/* IMAGE — slide left */}
        <motion.img
          src={assets.project3}
          className="w-[480px] rounded-xl hover:scale-105 transition-all duration-300"
          alt=""
          initial="initial"
          whileInView="animate"
           viewport={{ amount: 0.2, once: false }}
          variants={slideLeft}
        />

        {/* CARD — slide right */}
        <motion.div
          className="p-10 bg-card rounded-2xl border border-default
                      shadow-[0_0_20px_var(--glow-shadow)]
                      max-w-3xl hover:shadow-[0_0_30px_var(--glow-shadow)] hover:border-neon
                      transition-all"
          initial="initial"
          whileInView="animate"
        viewport={{ amount: 0.2, once: false }}
          variants={slideRight}
        >
          <h1 className="text-4xl font-bold text-gradient leading-tight">
            Powerful Project Management Features
          </h1>

          <p className="text-secondary text-lg mt-4 mb-6">
            TrackForge empowers you to create, manage, and own projects with ease.
          </p>

          {/* LIST */}
          <ul className="space-y-4 text-secondary text-base">
            {[
              "Create and organize multiple projects effortlessly",
              "Assign tasks and roles to team members",
              "Track real-time project activity and status updates",
              "Collaborate via comments, mentions, and notifications",
              "Maintain clear project ownership and control access",
            ].map((text, idx) => (
              <motion.li
                key={idx}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                 viewport={{ amount: 0.2, once: false }}
              >
                <Telescope className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 
                                      text-white h-10 w-10 rounded-full shadow-lg" />
                <span className="text-lg">{text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* ================= SECTION 2 – SHOWCASE ================= */}
      <div className="relative">
        <img
          src={assets.project}
          className="w-full h-[120vh] object-cover"
          style={{ opacity: "var(--showcase-img-opacity, 0.4)" }}
          alt=""
        />

        <div 
          className="absolute inset-0"
          style={{ background: "var(--showcase-overlay, linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.7)))" }}
        >

          {/* TITLE BLOCK — fade down */}
          <motion.div
            className="text-center p-10 bg-card border border-default rounded-2xl
                       shadow-[0_0_20px_var(--glow-shadow)] mb-10 max-w-4xl mx-auto mt-10"
            initial="initial"
            whileInView="animate"
             viewport={{ amount: 0.2, once: false }}
            variants={fadeDown}
          >
            <h1 className="text-5xl font-bold text-primary mb-4">
              Discover Projects in Motion
            </h1>

            <p className="text-secondary text-lg max-w-2xl mx-auto">
              Explore ongoing projects your teams are actively working on.
            </p>
          </motion.div>

          {/* SHOWCASE — fade-up */}
          <motion.div
            initial="initial"
            whileInView="animate"
             viewport={{ amount: 0.2, once: false }}
            variants={fadeUp}
          >
            <ProjectShowcase />
          </motion.div>

          {/* CTA BUTTON — smooth pop-in */}
          <motion.div
            className="w-fit mx-auto py-5"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
             viewport={{ amount: 0.2, once: false }}
          >
            <Link
              to="/register"
              className="inline-flex py-4 px-12 text-xl font-semibold btn-gradient 
                         rounded-xl shadow-lg 
                         hover:-translate-y-1 transition-all gap-3 items-center"
            >
              <Rocket className="bg-white text-pink-500 h-10 w-10 p-1.5 rounded-full" />
              Create Project Now
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ================= SECTION 3 - FEATURE GRID ================= */}
      <FeatureSection
        heading="Projects, Organized and Optimized"
        intro="From idea to release, TrackForge helps you structure and monitor every project stage..."
        features={[
          {
            icon: FiFolder,
            title: "Create & Own Projects",
            description:
              "Initiate and manage projects with control over access and scope.",
          },
          {
            icon: FiTool,
            title: "Bug & Issue Tracking",
            description:
              "Report, assign, and resolve issues with powerful ticketing tools.",
          },
          {
            icon: FiTrendingUp,
            title: "Real-Time Status Updates",
            description: "Monitor project progress and updates in real-time.",
          },
        ]}
      />
    </div>
  );
};

export default ProjectSection;
