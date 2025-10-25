import { motion } from "motion/react";

const Loader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/50 to-purple-800/20 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loader;
