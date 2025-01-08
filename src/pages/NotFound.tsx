import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const NotFound = () => {
  const navigate = useNavigate();
  const [isDarkMode] = useState(true); // Par défaut en mode sombre

  useEffect(() => {
    // Synchroniser avec le mode sombre de l'application
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-10 dark:opacity-100" />
      
      <div className="container relative mx-auto px-4 py-16 sm:py-32 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Numéro d'erreur animé */}
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20 
            }}
            className="relative"
          >
            <div className="text-[150px] sm:text-[200px] font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-[#666666] leading-none">
              404
            </div>
          </motion.div>

          {/* Message d'erreur */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-4xl font-bold">
              Page Not Found
            </h1>
            <p className="text-gray-600 dark:text-[#888888] max-w-md mx-auto">
              Oops! The page you're looking for seems to have wandered into the wrong theme. Let's get you back on track.
            </p>
          </div>

          {/* Bouton d'action */}
          <div className="pt-4">
            <Button 
              size="lg"
              className="gap-2 text-base bg-black hover:bg-gray-900 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black"
              onClick={() => navigate('/')}
            >
              <Home className="h-5 w-5" />
              Back to Home
            </Button>
          </div>

          {/* Élément décoratif */}
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              y: [0, -10, 10, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mt-12 opacity-50"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-xl" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound; 