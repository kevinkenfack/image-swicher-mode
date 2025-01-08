import { motion } from 'framer-motion';
import { Copy, Check, ChevronRight, Github } from 'lucide-react';
import { useState } from 'react';

const Documentation = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const CodeBlock = ({ code, index }: { code: string, index: number }) => (
    <div className="relative group">
      <pre className="overflow-x-auto p-4 rounded-lg bg-[#1a1a1a] text-[#888888] text-sm">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => handleCopy(code, index)}
        className="absolute top-3 right-3 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/10"
      >
        {copiedIndex === index ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-[#888888]" />
        )}
      </button>
    </div>
  );

  const sections = [
    {
      title: "Installation",
      content: [
        {
          text: "First, install the package using npm:",
          code: "npm install theme-image-switcher"
        },
        {
          text: "Or using yarn:",
          code: "yarn add theme-image-switcher"
        }
      ]
    },
    {
      title: "Basic Usage",
      content: [
        {
          text: "Import and use the component in your React application:",
          code: `import { ImageThemeUploader } from 'theme-image-switcher';

const App = () => {
  return (
    <ImageThemeUploader />
  );
};`
        }
      ]
    },
    {
      title: "Advanced Configuration",
      content: [
        {
          text: "Customize the component with props:",
          code: `<ImageThemeUploader
  onImageSelect={(theme, file) => {
    console.log(\`Selected \${file.name} for \${theme} theme\`);
  }}
  onImageRemove={(theme) => {
    console.log(\`Removed image for \${theme} theme\`);
  }}
/>`
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)]" />

      <div className="relative">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h1 className="text-4xl font-bold">Documentation</h1>
              <p className="text-[#888888]">
                Learn how to integrate and customize the Theme Image Switcher in your projects.
              </p>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-12"
            >
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-6">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <ChevronRight className="h-6 w-6 text-violet-500" />
                    {section.title}
                  </h2>
                  <div className="space-y-6">
                    {section.content.map((item, index) => (
                      <div key={index} className="space-y-3">
                        <p className="text-[#888888]">{item.text}</p>
                        <CodeBlock 
                          code={item.code} 
                          index={sectionIndex * 10 + index}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* GitHub Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 text-center"
            >
              <a
                href="https://github.com/votre-repo/theme-switcher"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#888888] hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
                View on GitHub
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation; 