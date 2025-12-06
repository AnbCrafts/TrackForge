import React from "react";
import {
  PlusCircle,
  Users,
  Search,
  FolderOpen,
  Rocket,
  Code,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const FirstTimeHome = ({ username }) => {
  const { hash } = useParams();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const subTextVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      key={location.pathname} // 🔥 reruns animation on route change
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen w-full bg-white flex flex-col items-center px-6 py-16 border-t border-gray-200"
    >

      {/* Heading Section */}
      <motion.div
      viewport={{ amount: 0.2, once: false }}
        className="text-center mb-16 max-w-2xl"
        variants={headingVariants}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Welcome,{" "}
          <span className="text-gradient">
            {username || "New User"}!
          </span>
        </h1>
      </motion.div>

      <motion.p
      viewport={{ amount: 0.2, once: false }}
        className="mt-4 text-lg text-gray-600 leading-relaxed max-w-2xl text-center mb-10"
        variants={subTextVariants}
      >
        TrackForge is your collaborative hub for managing projects, teams and bugs.
        Let’s get started with your productivity journey!
      </motion.p>

      {/* Grid of Actions */}
      <motion.div
      viewport={{ amount: 0.2, once: false }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full"
        variants={containerVariants}
      >

        {/* 1 — Start Working */}
        <motion.div viewport={{ amount: 0.2, once: false }} variants={cardVariants}>
          <Link
            to={`/auth/${hash}/${username}/workspace/code-editor`}
            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col
            items-center text-center shadow-md hover:shadow-xl 
            transition-all hover:-translate-y-1"
          >
            <Code className="h-12 w-12 text-purple-600 text-gradient mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">Start Working</h2>
            <p className="text-gray-500 mt-2">Begin inside the code editor.</p>
          </Link>
        </motion.div>

        {/* 2 — Create a Team */}
        <motion.div viewport={{ amount: 0.2, once: false }} variants={cardVariants}>
          <Link
            to={`/auth/${hash}/${username}/workspace/team`}
            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col
            items-center text-center shadow-md hover:shadow-xl 
            transition-all hover:-translate-y-1"
          >
            <PlusCircle className="h-12 w-12 text-purple-600 text-gradient mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">Create a Team</h2>
            <p className="text-gray-500 mt-2">Build and manage your members.</p>
          </Link>
        </motion.div>

        {/* 3 — Join a Team */}
        <motion.div viewport={{ amount: 0.2, once: false }} variants={cardVariants}>
          <Link
            to={`/auth/${hash}/${username}/workspace/team`}
            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col
            items-center text-center shadow-md hover:shadow-xl 
            transition-all hover:-translate-y-1"
          >
            <Users className="h-12 w-12 text-purple-600 text-gradient mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">Join a Team</h2>
            <p className="text-gray-500 mt-2">Already invited? Join instantly.</p>
          </Link>
        </motion.div>

        {/* 4 — Find Users */}
        <motion.div viewport={{ amount: 0.2, once: false }} variants={cardVariants}>
          <Link
            to={`/auth/${hash}/${username}/workspace/team`}
            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col
            items-center text-center shadow-md hover:shadow-xl 
            transition-all hover:-translate-y-1"
          >
            <Search className="h-12 w-12 text-purple-600 text-gradient mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">Find Users</h2>
            <p className="text-gray-500 mt-2">Search for collaborators.</p>
          </Link>
        </motion.div>

        {/* 5 — Explore Projects */}
        <motion.div viewport={{ amount: 0.2, once: false }} variants={cardVariants}>
          <Link
            to={`/auth/${hash}/${username}/workspace/projects`}
            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col
            items-center text-center shadow-md hover:shadow-xl 
            transition-all hover:-translate-y-1"
          >
            <FolderOpen className="h-12 w-12 text-purple-600 text-gradient mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">Explore Projects</h2>
            <p className="text-gray-500 mt-2">Browse, manage or contribute.</p>
          </Link>
        </motion.div>

        {/* 6 — Help / Quick Start */}
        <motion.div viewport={{ amount: 0.2, once: false }} variants={cardVariants}>
          <Link
            to={`/auth/${hash}/${username}/workspace/help`}
            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col
            items-center text-center shadow-md hover:shadow-xl 
            transition-all hover:-translate-y-1"
          >
            <Rocket className="h-12 w-12 text-purple-600 text-gradient mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">Quick Start Guide</h2>
            <p className="text-gray-500 mt-2">Learn how TrackForge works.</p>
          </Link>
        </motion.div>

      </motion.div>
    </motion.div>
  );
};

export default FirstTimeHome;
