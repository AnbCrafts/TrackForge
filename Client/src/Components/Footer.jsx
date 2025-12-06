import React from "react";
import { motion } from "framer-motion";
import {
  BookUserIcon,
  User,
  Users,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import SocialIcons from "./SocialMediaIcons";
import { assets } from "../assets/assets";

/* ----------------- ANIMATION VARIANTS ----------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15 },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

/* ------------------------------------------------------ */

const Footer = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-100px" }}
      className="px-6 py-20 bg-[#0A0A0C] text-white relative overflow-hidden"
    >

      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 
                      w-[900px] h-[900px] 
                      bg-[radial-gradient(circle,rgba(200,0,255,0.25),transparent)]
                      blur-[150px] opacity-60 -z-10"></div>

      {/* ====================== TOP CTA SECTION ====================== */}
      <motion.div
        variants={fadeUp}
         viewport={{ amount: 0.2, once: false }}
        className="neon-border p-14 bg-[#111318]/70 backdrop-blur-xl 
          rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-14"
      >
        {/* LEFT TEXT */}
        <motion.div variants={fadeLeft} className="w-full lg:w-2/3 space-y-6"  viewport={{ amount: 0.2, once: false }}>
          <p className="text-purple-300 text-lg tracking-wide">
            BUILT FOR MODERN ENGINEERS
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            A smarter way to build, debug  
            <br />
            & scale with  
            <span className="block mt-2 text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text">
              TrackForge
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl">
            Track tasks, resolve bugs, collaborate efficiently — all inside a fast,
            visually refined workspace engineered for speed.
          </p>

          <motion.div whileHover={{ scale: 1.04 }} className="w-fit">
            <Link
              to="/signup"
              className="inline-block mt-4 bg-gradient-to-r from-purple-600 to-pink-600 
                text-white py-3 px-14 rounded-xl text-xl font-semibold
                transition-all hover:brightness-110"
            >
              Get Started — It's Free
            </Link>
          </motion.div>
        </motion.div>

        {/* RIGHT FEATURE ICON LIST */}
        <motion.div variants={fadeRight}  viewport={{ amount: 0.2, once: false }} className="w-full lg:w-1/3 space-y-5">
          {[
            { icon: User, label: "Individual Developers" },
            { icon: Users, label: "Engineering Teams" },
            { icon: Workflow, label: "Agile Project Tracking" },
            { icon: BookUserIcon, label: "Client & Stakeholder Reports" },
          ].map((item, idx) => (
            <motion.div
             viewport={{ amount: 0.2, once: false }}
              key={idx}
              variants={fadeUp}
              custom={idx}
              whileHover={{ scale: 1.03, translateX: 5 }}
              className="flex items-center gap-4 p-4 rounded-xl
                bg-[#0A0A0C] border border-[#2d0a39]
                hover:border-purple-500 transition"
            >
              <item.icon className="h-10 w-10 p-2 rounded-full text-white 
                bg-gradient-to-r from-purple-500 to-pink-500" />
              <span className="text-gray-200 text-lg font-medium">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ====================== MIDDLE GRID ====================== */}
      <motion.div  viewport={{ amount: 0.2, once: false }} variants={fadeUp} className="space-y-14 mt-16">
        <div className="flex flex-wrap gap-12 p-12 rounded-2xl 
          bg-[#111318]/70 backdrop-blur-xl
          border border-[#34323d] shadow-[0_0_10px_rgba(255,255,255,0.05)]">

          {/* QUICK LINKS */}
          <motion.div  viewport={{ amount: 0.2, once: false }} variants={fadeUp} className="min-w-[180px]">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {["Home", "Dashboard", "Features", "Pricing", "FAQs", "Contact"].map((item, idx) => (
                <li key={idx}><a className="hover:text-pink-400">{item}</a></li>
              ))}
            </ul>
          </motion.div>

          {/* RESOURCES */}
          <motion.div  viewport={{ amount: 0.2, once: false }} variants={fadeUp} className="min-w-[180px]">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Resources</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {[
                "API Documentation",
                "User Guides",
                "Privacy Policy",
                "Terms & Conditions",
                "Changelog",
              ].map((item, idx) => (
                <li key={idx}><a className="hover:text-pink-400">{item}</a></li>
              ))}
            </ul>
          </motion.div>

          {/* CONTACT */}
          <motion.div  viewport={{ amount: 0.2, once: false }} variants={fadeUp} className="min-w-[180px]">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Contact</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>Email: <a className="hover:text-pink-400">support@trackforge.com</a></li>
              <li>Phone: <a className="hover:text-pink-400">+91 98765 43210</a></li>
              <li>Address: <p>TrackForge HQ, New Delhi, India</p></li>
            </ul>
          </motion.div>

          {/* SOCIAL + DESCRIPTION */}
          <motion.div  viewport={{ amount: 0.2, once: false }} variants={fadeUp} className="flex-1 space-y-6">
            <SocialIcons />

            <p className="text-gray-400 text-sm leading-relaxed">
              TrackForge improves team productivity and streamlines project workflows.
            </p>

            <div className="flex flex-wrap gap-4">
              {["Reliable", "Mission-Driven", "Innovation First"].map((text, idx) => (
                <motion.div
                 viewport={{ amount: 0.2, once: false }}
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#0A0A0C] border border-[#2d0a39] 
                    px-4 py-3 rounded-xl shadow-sm hover:border-pink-500 transition"
                >
                  <h3 className="text-pink-400 font-semibold">{text}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* ====================== BOTTOM FOOTER ====================== */}
      <motion.div
       viewport={{ amount: 0.2, once: false }}
        variants={fadeUp}
        className="flex flex-col lg:flex-row items-center justify-between gap-8 
          border border-[#2d0a39] p-6 mt-16 rounded-2xl bg-[#111318]/70"
      >
        <motion.div  viewport={{ amount: 0.2, once: false }} variants={fadeLeft} className="space-y-5">
          <Link to="/" className="flex items-center gap-4">
            <img src={assets.logo} className="w-[80px]" />
            <div>
              <h1 className="text-2xl font-semibold">TrackForge</h1>
              <span className="text-sm text-pink-400">— Your Debugging Partner</span>
            </div>
          </Link>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {["About Us", "Contact Us", "Security", "Privacy Policy", "Features", "Status"]
              .map((item, i) => (
                <Link key={i} className="hover:text-pink-400 cursor-pointer">{item}</Link>
              ))}
          </div>

          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} TrackForge. All rights reserved.
          </p>
        </motion.div>

        <motion.div  viewport={{ amount: 0.2, once: false }} variants={fadeRight} className="pb-4">
          <SocialIcons />
        </motion.div>
      </motion.div>

    </motion.div>
  );
};

export default Footer;
