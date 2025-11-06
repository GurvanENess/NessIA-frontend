import { motion } from "framer-motion";
import React from "react";
import ChatPage from "./components/ChatPage";

const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <ChatPage />
    </motion.div>
  );
};

export default Home;
