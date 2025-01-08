import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Types
interface Example {
  title: string;
  description: string;
  videoUrl: string;
  author: string;
  demoUrl?: string;
}

// Données des exemples
const examplesList: Example[] = [
  {
    title: "Theme Image Switcher Demo",
    description: "Official demo showcasing the theme switching capabilities with smooth transitions",
    videoUrl: "/demo.mp4",
    author: "Theme Switcher Team",
    demoUrl: "https://image-swicher-mode.vercel.app"
  },
  {
    title: "Theme Image Switcher Demo",
    description: "Official demo showcasing the theme switching capabilities with smooth transitions",
    videoUrl: "/demo.mp4",
    author: "Theme Switcher Team",
    demoUrl: "https://image-swicher-mode.vercel.app"
  },
  {
    title: "Theme Image Switcher Demo",
    description: "Official demo showcasing the theme switching capabilities with smooth transitions",
    videoUrl: "/demo.mp4",
    author: "Theme Switcher Team",
    demoUrl: "https://image-swicher-mode.vercel.app"
  }
];

// Composant ExampleCard
const ExampleCard = ({ example }: { example: Example }) => (
  <motion.div className="group relative rounded-xl border border-[#333333] bg-[#000000] overflow-hidden h-full">
    {/* Video Container */}
    <div className="relative aspect-video overflow-hidden">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={example.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>

    {/* Content */}
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{example.title}</h3>
      <p className="text-[#888888] text-sm mb-4">{example.description}</p>
      
      {/* Footer */}
      <div className="pt-4 flex items-center justify-between border-t border-[#333333]">
        <span className="text-[#888888] text-sm">{example.author}</span>
        {example.demoUrl && (
          <a
            href={example.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#888888] hover:text-white transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        )}
      </div>
    </div>
  </motion.div>
);

// Composant principal
const Examples = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)]" />

      <div className="relative">
        <div className="container mx-auto px-4">
          {/* Navigation */}
          <div className="py-6">
            <Button 
              variant="ghost" 
              className="gap-2 text-white hover:bg-[#333333]"
              onClick={() => navigate('/')}
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to Home
            </Button>
          </div>

          {/* Header */}
          <div className="max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h1 className="text-4xl font-bold">Examples Gallery</h1>
              <p className="text-[#888888]">
                Explore theme transitions created with Theme Image Switcher
              </p>
            </motion.div>
          </div>

          {/* Gallery Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          >
            {examplesList.map((example, index) => (
              <ExampleCard key={index} example={example} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Examples; 