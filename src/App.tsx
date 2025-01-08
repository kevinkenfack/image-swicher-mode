import './App.css'
import { useState, useEffect } from 'react'
import ImageThemeUploader from './components/ImageThemeUploader'
import { Github, ArrowRight, MonitorSmartphone, Image, Code, Sparkles, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

function App() {
  const [showTool, setShowTool] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const GITHUB_REPO = "https://github.com/votre-repo/theme-switcher"

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode])

  const ThemeToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      className="relative z-50 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-[#333333] dark:hover:bg-[#444444] transition-all duration-300"
      onClick={() => setIsDarkMode(!isDarkMode)}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-gray-600 dark:text-[#888888]" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600 dark:text-[#888888]" />
      )}
    </Button>
  )

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
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="py-6 flex justify-end">
          <ThemeToggle />
        </div>

        {/* Hero Section avec vidéo */}
        <header className="relative py-24">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-10 dark:opacity-100" />
          
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mb-6 flex items-center justify-center gap-2">
                <span className="rounded-full bg-gray-100 dark:bg-[#333333] px-3 py-1 text-sm text-gray-600 dark:text-[#888888]">
                  Open Source
                </span>
                <Sparkles className="h-4 w-4 text-gray-600 dark:text-[#888888]" />
              </div>
              
              <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-[#666666]">
                Theme Image Switcher
              </h1>
              
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-[#888888]">
                Create stunning theme transitions for your website. Upload, preview, and compare your light and dark themes with an interactive slider.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto gap-2 text-base sm:text-lg bg-black hover:bg-gray-900 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black"
                  onClick={() => setShowTool(true)}
                >
                  Try it now
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <a 
                  href={GITHUB_REPO} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto gap-2 text-base sm:text-lg border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-[#333333] dark:hover:border-[#444444] dark:hover:bg-[#111111]"
                  >
                    <Github className="h-5 w-5" />
                    Star on GitHub
                  </Button>
                </a>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-16 mx-auto max-w-4xl rounded-xl overflow-hidden border border-gray-200 dark:border-[#333333] bg-white/5 backdrop-blur-sm shadow-2xl"
              >
                <div className="relative aspect-video">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
              </motion.div>

            </motion.div>
          </div>
        </header>

        {/* Features Section */}
        <section className="py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-3"
          >
            {[
              {
                icon: MonitorSmartphone,
                title: "Dual Theme Support",
                description: "Seamlessly switch between light and dark themes with smooth transitions."
              },
              {
                icon: Image,
                title: "Drag & Drop",
                description: "Simple and intuitive image upload with drag and drop functionality."
              },
              {
                icon: Code,
                title: "Developer Friendly",
                description: "Built with modern technologies and fully customizable for your needs."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group rounded-lg border border-gray-200 dark:border-[#333333] bg-white dark:bg-[#000000] p-8 transition-all duration-300 hover:border-gray-300 dark:hover:border-[#444444] hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                <div className="mb-6 w-fit rounded-full bg-gray-100 dark:bg-[#333333] p-4">
                  <feature.icon className="h-6 w-6 text-gray-600 dark:text-[#888888]" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-[#888888]">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-gray-200 dark:border-[#333333]">
          <div className="text-center">
            <p className="text-gray-600 dark:text-[#888888]">
              © 2024 Theme Image Switcher. Built with ❤️ for developers.
            </p>
            <div className="mt-4 flex items-center justify-center gap-6">
              <a 
                href={GITHUB_REPO} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover:text-gray-900 dark:text-[#888888] dark:hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a 
                href="/docs" 
                className="text-gray-500 hover:text-gray-900 dark:text-[#888888] dark:hover:text-white transition-colors"
              >
                Documentation
              </a>
              <a 
                href="/examples" 
                className="text-gray-500 hover:text-gray-900 dark:text-[#888888] dark:hover:text-white transition-colors"
              >
                Examples
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App