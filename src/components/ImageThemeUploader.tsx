// ImageThemeUploader.tsx
import React, { useState, useCallback, useRef } from 'react';
import { Sun, Moon, Upload, AlertCircle, Trash2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Theme = 'light' | 'dark';

interface ImageState {
  url: string;
  file: File;
}

const ImageThemeUploader: React.FC = () => {
  const [images, setImages] = useState<Record<Theme, ImageState | null>>({
    light: null,
    dark: null
  });
  const [error, setError] = useState<Record<Theme, string>>({
    light: '',
    dark: ''
  });
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredTheme, setHoveredTheme] = useState<Theme | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleImageSelection = (theme: Theme, file: File) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImages(prev => ({
        ...prev,
        [theme]: { url, file }
      }));
      setError(prev => ({ ...prev, [theme]: '' }));
    } else {
      setError(prev => ({
        ...prev,
        [theme]: 'Le fichier sélectionné n\'est pas une image valide'
      }));
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    setSliderPosition((x / rect.width) * 100);
  }, [isDragging]);

  const handleSliderDrag = (e: React.MouseEvent) => {
    setIsDragging(true);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
    }, { once: true });
  };

  const DropZone: React.FC<{
    theme: Theme;
    image: ImageState | null;
    error?: string;
  }> = ({ theme, image, error }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const Icon = theme === 'light' ? Sun : Moon;

    return (
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onHoverStart={() => setHoveredTheme(theme)}
        onHoverEnd={() => setHoveredTheme(null)}
      >
        <div
          className={cn(
            "group relative overflow-hidden rounded-3xl transition-all duration-500",
            "border-2 border-dashed",
            error ? "border-red-500 bg-red-50/10" : "border-violet-200",
            image ? "bg-gradient-to-br from-violet-50/20 to-fuchsia-50/20" : "bg-background",
            hoveredTheme === theme && "border-violet-400 shadow-lg shadow-violet-100"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageSelection(theme, file);
            }}
          />

          <div className="flex min-h-[300px] flex-col items-center justify-center p-8">
            <AnimatePresence mode="wait">
              {image ? (
                <motion.div
                  className="relative w-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={image.url}
                    alt={`${theme} theme`}
                    className="mx-auto max-h-[220px] w-auto rounded-2xl object-contain shadow-xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="flex gap-3 rounded-2xl bg-black/75 p-4 backdrop-blur-md">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="bg-white/90 hover:bg-white"
                        onClick={() => inputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="lg"
                        onClick={() => {
                          setImages(prev => ({ ...prev, [theme]: null }));
                          setError(prev => ({ ...prev, [theme]: '' }));
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <motion.div
                    className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => inputRef.current?.click()}
                  >
                    <Icon className="h-12 w-12 text-violet-600" />
                  </motion.div>
                  <h3 className="mb-2 text-xl font-semibold text-violet-900">
                    Mode {theme === 'light' ? 'clair' : 'sombre'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Glissez une image ou cliquez pour parcourir
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto w-full max-w-6xl space-y-8 p-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 shadow-2xl">
        <CardHeader className="border-b border-violet-100/50 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-violet-500" />
            <CardTitle className="text-xl font-semibold text-violet-900">
              Téléchargeur d'Images Thématiques
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-8 p-8 md:grid-cols-2">
          <DropZone theme="light" image={images.light} error={error.light} />
          <DropZone theme="dark" image={images.dark} error={error.dark} />
        </CardContent>
      </Card>

      <AnimatePresence>
        {(images.light || images.dark) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 shadow-2xl">
              <CardHeader className="border-b border-violet-100/50 bg-white/50 backdrop-blur-sm">
                <CardTitle className="text-lg font-medium text-violet-900">
                  Prévisualisation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  ref={sliderRef}
                  className="relative aspect-video w-full overflow-hidden bg-[url('/grid.png')] bg-repeat"
                >
                  {images.dark?.url && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={images.dark.url}
                        alt="Theme sombre"
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                  )}

                  {images.light?.url && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0"
                      style={{
                        clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                      }}
                    >
                      <img
                        src={images.light.url}
                        alt="Theme clair"
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                  )}

                  {images.light?.url && images.dark?.url && (
                    <motion.div
                      className="absolute top-0 bottom-0 z-10 group"
                      style={{ left: `${sliderPosition}%` }}
                      onMouseDown={handleSliderDrag}
                    >
                      <motion.div 
                        className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/80 via-white to-white/80 backdrop-blur-sm"
                        style={{ left: '50%', transform: 'translateX(-50%)' }}
                        whileHover={{ scale: [null, 1.5, 1.2] }}
                        transition={{ duration: 0.3 }}
                      />

                      <motion.div
                        className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="relative h-full w-full">
                          <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md shadow-lg" />
                          
                          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/80 to-white/40 shadow-inner" />
                          
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex gap-1">
                              <motion.div 
                                className="h-1 w-1 rounded-full bg-violet-500"
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                              <motion.div 
                                className="h-1 w-1 rounded-full bg-violet-500"
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                              />
                              <motion.div 
                                className="h-1 w-1 rounded-full bg-violet-500"
                                animate={{ opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="absolute top-0 h-full w-[1px] bg-white/40"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        style={{ 
                          left: '50%', 
                          transform: 'translateX(-50%)',
                          boxShadow: '0 0 15px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.3), 0 0 45px rgba(255,255,255,0.1)' 
                        }}
                      />
                    </motion.div>
                  )}

                  {(!images.light?.url || !images.dark?.url) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm"
                    >
                      <motion.p
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="rounded-2xl bg-white/90 px-8 py-4 text-sm text-gray-600 shadow-xl ring-1 ring-violet-100"
                      >
                        {!images.light?.url && !images.dark?.url
                          ? "Ajoutez des images pour voir la prévisualisation"
                          : !images.light?.url
                          ? "Ajoutez une image pour le mode clair"
                          : "Ajoutez une image pour le mode sombre"}
                      </motion.p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageThemeUploader;