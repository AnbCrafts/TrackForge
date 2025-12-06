import React from "react";
import { FiActivity, FiShield, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { FeatureSection } from "./FeatureSection";
import { motion } from "framer-motion";

// MOTION PRESETS
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const slideLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

const slideRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

const IndividualUsers = () => {
  return (
    <div className="py-24 relative">

      {/* Background Glow */}
      <div
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 
                    w-[600px] h-[600px] rounded-full 
                    bg-[radial-gradient(circle,rgba(200,0,255,0.35),rgba(0,0,0,0.95))] 
                    blur-3xl opacity-70 -z-10"
      ></div>

      {/* ===================== MAIN CONTENT ===================== */}
      <div className="flex max-w-7xl mx-auto items-center justify-between gap-16 flex-row-reverse flex-wrap px-6">

        {/* IMAGE */}
        <motion.img
          src={assets.cover_img}
          className="w-[480px] rounded-2xl hover:scale-105 transition-all duration-300"
          alt="cover"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideRight}
        />

        {/* CARD */}
        <motion.div
          className="bg-[#111318] p-10 rounded-2xl  
                      border border-[#2d0a39] 
                      max-w-xl 
                      hover:shadow-[0_0_40px_rgba(255,0,180,0.55)] 
                      transition-all duration-300"
          initial="initial"
          whileInView="animate"
           viewport={{ amount: 0.2, once: false }}
          variants={slideLeft}
        >
          <h1
            className="text-5xl font-semibold bg-gradient-to-r 
                         from-purple-400 to-pink-500 bg-clip-text text-transparent"
          >
            For Individual Users
          </h1>

          <p className="text-lg text-gray-300 font-medium pt-4 leading-relaxed">
            Explore the features and facilities we provide for a user to enhance
            your work experience and make your job easy.
          </p>

          {/* BUTTON */}
          <div className="mt-8">
            <Link
              className="py-3 px-10 text-lg font-semibold 
                         bg-gradient-to-r from-purple-500 to-pink-600 
                         text-white rounded-lg shadow-[0_0_20px_rgba(255,0,200,0.45)] 
                         hover:shadow-[0_0_35px_rgba(255,0,200,0.75)] 
                         transition-all"
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ===================== FEATURE SECTION ===================== */}
      <FeatureSection
        heading="Your Personal Command Center"
        intro="TrackForge empowers individual users to manage tasks, stay updated, and control their contributions across all projects and teams—efficiently and intuitively."
        features={[
          {
            icon: FiUser,
            title: "Personalized Dashboard",
            description:
              "View assigned issues, recent activity, and project updates—all in one place.",
          },
          {
            icon: FiShield,
            title: "Secure & Private Access",
            description:
              "Role-based control ensures your data stays private and protected.",
          },
          {
            icon: FiActivity,
            title: "Activity History",
            description:
              "Track everything you’ve done, what’s pending, and what’s next.",
          },
        ]}
      />
    </div>
  );
};

export default IndividualUsers;
