import React, { useContext } from "react";
import {
  PlusCircle,
  Users,
  FolderOpen,
  Rocket,
  Code,
  Calendar,
  MessageSquare,
  Bug,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const FirstTimeHome = ({ username }) => {
  const { hash } = useParams();
  const { authUserData } = useContext(TrackForgeContextAPI);
  const role = authUserData?.role || "Developer";
  const isAdminOrOwner = role === "Owner" || role === "Admin";

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

  // Actions list based on Role
  const adminCards = [
    {
      to: `/auth/${hash}/${username}/workspace/projects`,
      icon: FolderOpen,
      title: "Create & Manage Projects",
      desc: "Initialize a new project and add collaborators.",
    },
    {
      to: `/auth/${hash}/${username}/workspace/team`,
      icon: PlusCircle,
      title: "Create a Team",
      desc: "Assemble, assign, and manage team members.",
    },
    {
      to: `/auth/${hash}/${username}/workspace/meetings`,
      icon: Calendar,
      title: "Schedule a Meeting",
      desc: "Organize real-time rooms and invite guests.",
    },
    {
      to: `/auth/${hash}/${username}/workspace/members`,
      icon: MessageSquare,
      title: "Inbox / Chat",
      desc: "Chat with teammates and send direct updates.",
    },
    {
      to: `/auth/${hash}/${username}/workspace/code-editor/view-project`,
      icon: Code,
      title: "Start Working",
      desc: "Begin inside the online code editor.",
    },
    {
      to: `/auth/${hash}/${username}/workspace/help`,
      icon: Rocket,
      title: "Quick Start Guide",
      desc: "Learn how TrackForge works.",
    },
  ];

  const userCards = [
    {
      to: `/auth/${hash}/${username}/workspace/team`,
      icon: Users,
      title: "My Teams",
      desc: "Check your active teams and members.",
    },
    {
      to: `/auth/${hash}/${username}/workspace/bugs`,
      icon: Bug,
      title: "Bugs & Tickets",
      desc: "View tickets, log activity, and solve bugs.",
    },
    {
      to: `/auth/${hash}/${username}/workspace/members`,
      icon: MessageSquare,
      title: "Inbox / Chat",
      desc: "Chat with your Admin/Owner and teammates.",
    },
    {
      to: `/auth/${hash}/${username}/workspace/code-editor/view-project`,
      icon: Code,
      title: "Start Working",
      desc: "Begin inside the online code editor.",
    },
    {
      to: `/auth/${hash}/${username}/workspace/projects`,
      icon: FolderOpen,
      title: "Explore Projects",
      desc: "Browse project directories and files.",
    },
    {
      to: `/auth/${hash}/${username}/workspace/help`,
      icon: Rocket,
      title: "Quick Start Guide",
      desc: "Learn how TrackForge works.",
    },
  ];

  const activeCards = isAdminOrOwner ? adminCards : userCards;

  return (
    <motion.div
      key={location.pathname}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen w-full bg-white flex flex-col items-center px-6 py-16 border-t border-gray-200"
    >
      {/* Heading Section */}
      <motion.div
        viewport={{ amount: 0.2, once: false }}
        className="text-center mb-6 max-w-2xl"
        variants={headingVariants}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Welcome,{" "}
          <span className="text-gradient">
            {username || "New User"}!
          </span>
        </h1>
        <span className="inline-block mt-3 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full text-xs font-bold text-purple-700 uppercase tracking-wider">
          {role} Workspace
        </span>
      </motion.div>

      <motion.p
        viewport={{ amount: 0.2, once: false }}
        className="text-base text-gray-600 leading-relaxed max-w-2xl text-center mb-12"
        variants={subTextVariants}
      >
        {isAdminOrOwner
          ? "You are logged into the Admin Dashboard. Initialize new projects, configure your teams, schedule meetings, and coordinate tasks."
          : "You are logged into the Team Workspace. Browse assigned projects, view bugs/tickets, collaborate with peers, and log updates."}
      </motion.p>

      {/* Grid of Actions */}
      <motion.div
        viewport={{ amount: 0.2, once: false }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full"
        variants={containerVariants}
      >
        {activeCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div key={idx} viewport={{ amount: 0.2, once: false }} variants={cardVariants}>
              <Link
                to={card.to}
                className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col
                items-center text-center shadow-md hover:shadow-xl 
                transition-all hover:-translate-y-1 h-full min-h-[180px] justify-center"
              >
                <Icon className="h-10 w-10 text-purple-600 mb-3 shrink-0" />
                <h2 className="text-base font-semibold text-gray-900">{card.title}</h2>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{card.desc}</p>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default FirstTimeHome;
