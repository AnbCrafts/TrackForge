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
    <div className="relative bg-[#0A0A0C] text-white">

      {/* BACKGROUND GLOW */}
      <div
        className="absolute top-40 right-1/4 w-[600px] h-[600px] rounded-full
                    bg-[radial-gradient(circle,rgba(200,0,255,0.3),rgba(0,0,0,0.95))]
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
          className="p-10 bg-[#111318] rounded-2xl border border-[#2d0a39]
                      shadow-[0_0_40px_rgba(200,0,255,0.35)]
                      max-w-3xl hover:shadow-[0_0_60px_rgba(255,0,200,0.55)]
                      transition-all"
          initial="initial"
          whileInView="animate"
        viewport={{ amount: 0.2, once: false }}
          variants={slideRight}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 
                         bg-clip-text text-transparent">
            Powerful Project Management Features
          </h1>

          <p className="text-gray-300 text-lg mt-4 mb-6">
            TrackForge empowers you to create, manage, and own projects with ease...
          </p>

          {/* LIST */}
          <ul className="space-y-4 text-gray-300 text-base">
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
          className="w-full h-[120vh] object-cover opacity-40"
          alt=""
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/85 to-black/90">

          {/* TITLE BLOCK — fade down */}
          <motion.div
            className="text-center p-10 bg-[#111318] 
                       shadow-[0_0_30px_rgba(200,0,255,0.2)] mb-10"
            initial="initial"
            whileInView="animate"
             viewport={{ amount: 0.2, once: false }}
            variants={fadeDown}
          >
            <h1 className="text-5xl font-bold text-purple-200 mb-4">
              Discover Projects in Motion
            </h1>

            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Explore ongoing projects your teams are actively working on...
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
              className="py-4 px-12 text-xl font-semibold text-white 
                         bg-gradient-to-r from-purple-600 to-pink-600 
                         rounded-xl shadow-[0_0_25px_rgba(255,0,200,0.45)] 
                         hover:-translate-y-1 transition-all flex gap-3 items-center"
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
