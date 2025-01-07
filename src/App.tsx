import './App.css'
import { useState } from 'react'
import ImageThemeUploader from './components/ImageThemeUploader'
import { Github, ArrowRight, MonitorSmartphone, Image, SlidersHorizontal, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

function App() {
  const [showTool, setShowTool] = useState(false);
  const GITHUB_REPO = "https://github.com/votre-repo/theme-switcher" // À remplacer par votre lien

  if (showTool) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-fuchsia-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <Button 
              variant="ghost" 
              className="gap-2"
              onClick={() => setShowTool(false)}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <a 
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </a>
          </div>
          <div className="rounded-3xl bg-white/50 p-8 shadow-xl backdrop-blur-sm">
            <ImageThemeUploader />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-fuchsia-50">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <h1 className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
          Theme Image Switcher
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Créez une expérience visuelle unique avec notre outil de transition entre thèmes clair et sombre. 
          Téléchargez, prévisualisez et comparez vos images en temps réel.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => setShowTool(true)}
          >
            Essayer l'outil
            <ArrowRight className="h-4 w-4" />
          </Button>
          <a 
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline" className="gap-2">
              <Github className="h-4 w-4" />
              Voir sur GitHub
            </Button>
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-lg transition-transform hover:-translate-y-1">
            <div className="mb-4 w-fit rounded-full bg-violet-100 p-3">
              <MonitorSmartphone className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Double Thème
            </h3>
            <p className="text-gray-600">
              Supportez les modes clair et sombre avec une transition fluide entre les deux thèmes.
            </p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-lg transition-transform hover:-translate-y-1">
            <div className="mb-4 w-fit rounded-full bg-violet-100 p-3">
              <Image className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Glisser-Déposer
            </h3>
            <p className="text-gray-600">
              Téléchargez vos images facilement par simple glisser-déposer ou sélection de fichier.
            </p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-lg transition-transform hover:-translate-y-1">
            <div className="mb-4 w-fit rounded-full bg-violet-100 p-3">
              <SlidersHorizontal className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Prévisualisation Interactive
            </h3>
            <p className="text-gray-600">
              Comparez vos thèmes en temps réel avec notre curseur de transition interactif.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white/50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 Theme Image Switcher. Tous droits réservés.</p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <a 
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-violet-600 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App