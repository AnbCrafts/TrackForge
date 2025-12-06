import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
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
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
};

// ===================== CARD ===================== //
const FeatureCard = ({ Icon, title, description }) => (
  <motion.div
    variants={staggerChild}
     viewport={{ amount: 0.2, once: false }}
    className="bg-[#111318] border border-[#2d0a39] p-6 rounded-xl
               shadow-[0_0_25px_rgba(200,0,255,0.25)]
               hover:shadow-[0_0_45px_rgba(255,0,200,0.5)]
               hover:-translate-y-1 hover:scale-[1.03]
               transition-all duration-300"
  >
    {/* Icon */}
    <div className="mb-4">
      <Icon
        className="h-12 w-12 p-2 rounded-full
                   bg-gradient-to-r from-purple-500 to-pink-500
                   text-white shadow-lg"
      />
    </div>

    {/* Title */}
    <h3 className="text-xl font-semibold text-purple-200 mb-2">{title}</h3>

    {/* Description */}
    <p className="text-gray-300 leading-relaxed">{description}</p>
  </motion.div>
);

// ===================== MAIN SECTION ===================== //
export const FeatureSection = ({ heading, intro, features }) => (
  <motion.section
    className="py-20 px-10 w-full mx-auto text-white relative"
    initial="initial"
    whileInView="animate"
     viewport={{ amount: 0.2, once: false }}
    variants={fadeUp}
  >
    {/* Background Glow */}
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px]
                 bg-[radial-gradient(circle,rgba(200,0,255,0.25),rgba(0,0,0,0.95))]
                 blur-3xl opacity-60 -z-10"
    ></div>

    <div className="max-w-7xl mx-auto">

      {/* Heading */}
      <motion.h2
        className="text-4xl font-bold mb-4
                   bg-gradient-to-r from-purple-400 to-pink-500
                   bg-clip-text text-transparent"
        variants={fadeUp}
         viewport={{ amount: 0.2, once: false }}
      >
        {heading}
      </motion.h2>

      {/* Intro */}
      <motion.p
        className="text-gray-300 mb-12 max-w-3xl leading-relaxed"
        variants={fadeUp}
         viewport={{ amount: 0.2, once: false }}
        transition={{ delay: 0.1 }}
      >
        {intro}
      </motion.p>

      {/* Features Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={staggerParent}
         viewport={{ amount: 0.2, once: false }}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            Icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </motion.div>
    </div>
  </motion.section>
);
