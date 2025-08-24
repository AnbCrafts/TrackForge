import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function ExamplePresence() {
  const [show, setShow] = useState(true);

  return (
    <div className="p-6">
      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded"
        onClick={() => setShow(!show)}
      >
        Toggle Box
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            key="box"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="mt-4 w-32 h-32 bg-pink-500 rounded"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
