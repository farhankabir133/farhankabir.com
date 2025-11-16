import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { MessageCircle, Sparkles, X } from 'lucide-react';

interface ChatbotIconProps {
  isOpen: boolean;
  onClick: () => void;
  hasUnreadMessages?: boolean;
  isDarkMode?: boolean;
}

const aiAnimationData = { /* Retaining existing animation data */ v: "5.7.4", fr: 30, ip: 0, op: 60, w: 100, h: 100, nm: "AI Assistant", ddd: 0, assets: [], layers: [ { ddd: 0, ind: 1, ty: 4, nm: "Circle", sr: 1, ks: { o: { a: 0, k: 100 }, r: { a: 1, k: [ { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] }, { t: 60, s: [360] } ] }, p: { a: 0, k: [50, 50, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } }, ao: 0, shapes: [ { ty: "gr", it: [ { d: 1, ty: "el", s: { a: 0, k: [60, 60] }, p: { a: 0, k: [0, 0] } }, { ty: "fl", c: { a: 0, k: [0.2, 0.6, 1, 1] }, o: { a: 0, k: 100 } } ] } ], ip: 0, op: 60, st: 0 } ] };

const ChatbotIcon: React.FC<ChatbotIconProps> = ({
  isOpen,
  onClick,
  hasUnreadMessages = false,
}) => {
  return (
    <motion.div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.button
        onClick={onClick}
        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-xl backdrop-blur-lg border transition-all duration-300 ${isOpen ? 'bg-red-500/90 hover:bg-red-600/90 border-white/20' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-gray-300 dark:border-white/20'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close Chat" : "Open Chat"}
        animate={hasUnreadMessages && !isOpen ? { 
          boxShadow: [
            "0 0 0 0px rgba(59, 130, 246, 0.7)",
            "0 0 0 12px rgba(59, 130, 246, 0)",
            "0 0 0 0px rgba(59, 130, 246, 0)"
          ]
        } : {}}
        transition={{ duration: 1.5, repeat: hasUnreadMessages ? Infinity : 0, ease: 'easeInOut' }}
      >
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-30">
          <Lottie
            animationData={aiAnimationData}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Icon */}
        <AnimatePresence>
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex items-center justify-center w-full h-full"
          >
            {isOpen ? (
              <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            ) : (
              <div className="relative">
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Notification Badge */}
        {hasUnreadMessages && !isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.5 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 transition-colors duration-300"
          />
        )}
      </motion.button>

      {/* Tooltip for desktop */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 1 }}
          className="hidden sm:block absolute right-full top-1/2 transform -translate-y-1/2 mr-4 bg-white/90 dark:bg-slate-800/90 text-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg pointer-events-none transition-colors duration-300"
        >
          Have a question? Ask my AI!
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-white/90 dark:border-l-slate-800/90 transition-colors duration-300"></div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatbotIcon;
