import React from "react";
import { assets } from "../assets/assets";
import { MemoryStick, Proportions, RollerCoaster } from "lucide-react";
import { FiBarChart2, FiBell, FiUsers } from "react-icons/fi";
import { FeatureSection } from "./FeatureSection";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Motion Presets
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

const slideLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

const slideRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

const TeamUsers = () => {
  return (
    <div className="pt-24 bg-[#0A0A0C] text-white relative">

      {/* BACKGROUND GLOW */}
      <div
        className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full 
                    bg-[radial-gradient(circle,rgba(200,0,255,0.25),rgba(0,0,0,0.95))] 
                    blur-3xl opacity-70 -z-10"
      ></div>

      {/* ================= SECTION 1 ================= */}
      <div className="flex items-center justify-between gap-16 flex-wrap px-6 max-w-7xl mx-auto">

        {/* CARD — slide left */}
        <motion.div
          className="p-10 rounded-2xl bg-[#111318] border border-[#2d0a39]
                      shadow-[0_0_30px_rgba(200,0,255,0.35)]
                      hover:shadow-[0_0_50px_rgba(255,0,200,0.55)]
                      transition-all max-w-xl"
          initial="initial"
          whileInView="animate"
           viewport={{ amount: 0.2, once: false }}
          variants={slideLeft}
        >
          <h1 className="text-4xl font-semibold bg-gradient-to-r 
                         from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Do we have any features for Team ??
          </h1>

          <p className="text-gray-300 text-lg mt-3">
            Absolutely Yes!! Explore our platform features and create your own team.
          </p>

          <div className="mt-8">
            <Link
              className="py-3 px-10 text-lg font-semibold 
                         bg-gradient-to-r from-purple-500 to-pink-600 
                         text-white rounded-lg shadow-[0_0_20px_rgba(255,0,200,0.45)] 
                         hover:shadow-[0_0_40px_rgba(255,0,200,0.75)]
                         transition-all"
            >
              Create Team
            </Link>
          </div>
        </motion.div>

        {/* IMAGE — slide right */}
        <motion.img
          src={assets.team}
          className="w-[480px] rounded-lg hover:scale-105 transition-all duration-300"
          alt="team img"
          initial="initial"
          whileInView="animate"
           viewport={{ amount: 0.2, once: false }}
          variants={slideRight}
        />
      </div>

      {/* ================= FEATURE SECTION ================= */}
      <div className="mt-16">
        <FeatureSection
          heading="Collaboration Without Chaos"
          intro="Build and manage agile teams with role-based permissions, real-time updates, and centralized communication—designed to eliminate bottlenecks."
          features={[
            {
              icon: FiUsers,
              title: "Create & Manage Teams",
              description:
                "Form teams for specific projects and assign roles like Admin, Developer, Tester, etc.",
            },
            {
              icon: FiBell,
              title: "Shared Notifications",
              description:
                "Keep everyone in sync with changes, mentions, and updates.",
            },
            {
              icon: FiBarChart2,
              title: "Team Activity Analytics",
              description:
                "Gain insights into team performance and contribution trends.",
            },
          ]}
        />
      </div>

      {/* ================= SECTION 2 — Manage Team Activities ================= */}
      <div className="flex items-start justify-center gap-16 w-full mt-20 px-6 py-20 
                      bg-[#0D0F14] rounded-2xl">

        {/* LEFT COLUMN: chained fade-ups */}
        <motion.div
          initial="initial"
          whileInView="animate"
           viewport={{ amount: 0.2, once: false }}
          variants={fadeUp}
        >
          {/* MAIN CARD */}
          <motion.div
           viewport={{ amount: 0.2, once: false }}
            variants={fadeUp}
            className="p-10 bg-[#111318] rounded-2xl border border-[#2d0a39]
                        shadow-[0_0_30px_rgba(200,0,255,0.35)] max-w-xl"
          >
            <h1 className="text-4xl font-semibold text-purple-300 mb-3">
              Manage Team Activities
            </h1>
            <p className="text-gray-400 leading-relaxed">
              Stay on top of your team's workflow with centralized activity tracking.
              Collaborate seamlessly by adding comments, tagging team members,
              and resolving issues together in real-time.
            </p>
          </motion.div>

          {/* ACTION CARDS (cascade animation) */}
          {[
            { text: "Utilize your role", Icon: RollerCoaster },
            { text: "Interact with your team", Icon: MemoryStick },
            { text: "Give your 100%", Icon: Proportions },
          ].map(({ text, Icon }, idx) => (
            <motion.div
              key={idx}
              className="mt-6 py-5 px-10 flex items-center gap-5 
                        bg-gradient-to-r from-purple-600 to-pink-600 w-fit 
                        rounded-xl shadow-[0_0_25px_rgba(255,0,200,0.45)]
                        hover:shadow-[0_0_40px_rgba(255,0,200,0.75)]
                        transition-all cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
               viewport={{ amount: 0.2, once: false }}
            >
              <h1 className="text-white font-semibold text-lg">{text}</h1>
              <Icon className="h-12 w-12 p-2 bg-[#0A0A0C] text-purple-300 
                               rounded-full shadow-lg" />
            </motion.div>
          ))}
        </motion.div>

        {/* RIGHT IMAGE — slide in */}
        <motion.img
          src={assets.manage}
          className="w-[460px] rounded-xl"
          alt="manage"
          initial="initial"
          whileInView="animate"
          variants={slideRight}
           viewport={{ amount: 0.2, once: false }}
        />
      </div>

      {/* ================= SECTION 3 — Dashboard Preview ================= */}
      <div className="relative w-full mt-20 max-h-[100vh] min-h-[60vh]">

        <div className="absolute inset-0 flex items-center justify-center gap-10 px-10">

          {/* TEXT */}
          <motion.div
            className="max-w-2xl"
            initial="initial"
            whileInView="animate"
             viewport={{ amount: 0.2, once: false }}
            variants={slideLeft}
          >
            <div className="p-10 bg-[#111318] rounded-2xl border border-[#2d0a39]
                            shadow-[0_0_30px_rgba(200,0,255,0.35)]">
              <h1 className="text-5xl text-purple-200 font-bold mb-6">
                Personalized Dashboards for Your Team
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed">
                Give every team member a clear, focused view of their tasks,
                projects, and activity. TrackForge's customizable dashboards
                ensure that everyone—from developers to project leads—
                sees exactly what matters.
              </p>
            </div>
          </motion.div>

          {/* IMAGE */}
          <motion.img
            src={assets.dashboard}
            className="w-[480px] rounded-xl"
            alt="dashboard"
            initial="initial"
            whileInView="animate"
            viewport={{ amount: 0.2, once: false }}
            variants={slideRight}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamUsers;
