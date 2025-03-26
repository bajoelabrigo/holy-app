import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { motion } from "framer-motion";

const OAuth = ({text}) => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="btn btn-newtral w-full "
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      {text}
    </motion.button>
  );
};

export default OAuth;
