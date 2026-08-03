import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
