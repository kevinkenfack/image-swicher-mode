import { Button } from '@/components/ui/button';
import { Github, ArrowRight} from 'lucide-react';
import ImageThemeUploader from '@/components/ImageThemeUploader';
import { useState } from 'react';

interface HomeProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  ThemeToggle: () => JSX.Element;
}

const Home = ({ ThemeToggle }: HomeProps) => {
  const [showTool, setShowTool] = useState(false);
  const GITHUB_REPO = "https://github.com/votre-repo/theme-switcher";

  if (showTool) {
    return (
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto flex items-center gap-4">
              <Button 
                variant="ghost" 
                className="gap-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#333333]"
                onClick={() => setShowTool(false)}
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to Home
              </Button>
              <ThemeToggle />
            </div>
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                className="gap-2 border-gray-200 dark:border-[#333333] hover:border-gray-300 dark:hover:border-[#444444] hover:bg-gray-50 dark:hover:bg-[#111111] text-gray-900 dark:text-white"
              >
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </a>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-[#333333] bg-white dark:bg-[#000000] p-8">
            <ImageThemeUploader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="py-6 flex justify-end">
          <ThemeToggle />
        </div>

        {/* Hero Section avec vidéo */}
        <header className="relative py-24">
          {/* ... Copier tout le reste du contenu de l'ancien App.tsx ici ... */}
          {/* Je ne montre pas tout le code pour la lisibilité, mais il faut copier tout le contenu */}
        </header>

        {/* Features Section */}
        <section className="py-24">
          {/* ... */}
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-gray-200 dark:border-[#333333]">
          {/* ... */}
        </footer>
      </div>
    </div>
  );
};

export default Home; 