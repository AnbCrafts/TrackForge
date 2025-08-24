import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Intro = () => {
  const [animateOnLoad, setAnimateOnLoad] = useState(false);

  useEffect(() => {
    // Trigger animation only when component mounts
    setAnimateOnLoad(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={animateOnLoad ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="bg-white p-10 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to TrackForge
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your projects and tickets effortlessly
        </p>
      </motion.div>
    </div>
  );
};

export default Intro;
