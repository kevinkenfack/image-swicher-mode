import React, { useState, useCallback, useRef } from 'react';
import { Sun, Moon, Upload, AlertCircle, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnimatePresence, motion } from 'framer-motion';

type Theme = 'light' | 'dark';

interface ImageState {
  url: string;
  file: File;
}

interface DropZoneProps {
  theme: Theme;
  image: ImageState | null;
  icon: React.ElementType;
  onImageSelect: (theme: Theme, file: File) => void;
  onImageRemove: (theme: Theme) => void;
  error?: string;
}

const DropZone: React.FC<DropZoneProps> = ({
  theme,
  image,
  icon: Icon,
  onImageSelect,
  onImageRemove,
  error
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <div
        className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ease-out
          ${error ? 'ring-2 ring-red-500 bg-red-50/30' : 'hover:ring-2 hover:ring-violet-400/50'}
          ${image ? 'bg-white/20 backdrop-blur-sm' : 'bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md'}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file?.type.startsWith('image/')) onImageSelect(theme, file);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImageSelect(theme, file);
          }}
        />
        <div className="relative flex min-h-[300px] flex-col items-center justify-center p-8">
          {image ? (
            <div className="relative w-full">
              <img
                src={image.url}
                alt={`${theme} theme`}
                className="mx-auto max-h-[220px] w-auto rounded-2xl object-contain shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
                <div className="flex gap-4 scale-90 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white/90 hover:bg-white shadow-lg"
                    onClick={() => inputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    className="shadow-lg"
                    onClick={() => onImageRemove(theme)}
                  >
                    <Trash2 className="mr-2 h-5 w-5" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="group/btn w-full transition-all duration-300"
                    onClick={() => inputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-2xl opacity-20 group-hover/btn:opacity-30 transition-opacity" />
                        <div className="relative rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-8 transition-all duration-500 group-hover/btn:scale-110">
                          <Icon className="h-12 w-12 text-violet-600" />
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-xl font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                          Mode {theme === 'light' ? 'Clair' : 'Sombre'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Glissez une image ou cliquez pour parcourir
                        </p>
                      </div>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Format recommandé : 16:9</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
  const sliderRef = useRef<HTMLDivElement>(null);
  const inputRefs = {
    light: useRef<HTMLInputElement>(null),
    dark: useRef<HTMLInputElement>(null)
  };

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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const percentage = (x / rect.width) * 100;
    
    setSliderPosition(percentage);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const ThemePreview: React.FC = () => {
    if (!images.light && !images.dark) return null;

    return (
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-violet-50 to-fuchsia-50 shadow-xl">
        <CardHeader className="border-b border-violet-100/50 bg-white/50 px-6 py-4 backdrop-blur-sm">
          <CardTitle className="text-lg font-medium text-violet-800">Prévisualisation</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            ref={sliderRef}
            className="relative aspect-video w-full overflow-hidden bg-[url('/grid.png')] bg-repeat"
          >
            {images.dark?.url && (
              <div className="absolute inset-0 transition-opacity duration-500">
                <img
                  src={images.dark.url}
                  alt="Theme sombre"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            
            {images.light?.url && (
              <div 
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                }}
              >
                <img
                  src={images.light.url}
                  alt="Theme clair"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {images.light?.url && images.dark?.url && (
              <div
                className="absolute top-0 bottom-0 z-10 cursor-ew-resize group"
                style={{ 
                  left: `${sliderPosition}%`,
                  transform: 'translateX(-50%)'
                }}
                onMouseDown={handleMouseDown}
              >
                <div className="absolute inset-y-0 w-[2px] flex flex-col justify-between">
                  <div className="w-full h-1/3 bg-gradient-to-b from-white/80 to-white/20" />
                  <div className="w-full h-1/3 bg-white/20" />
                  <div className="w-full h-1/3 bg-gradient-to-t from-white/80 to-white/20" />
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 p-[2px] transition-all duration-300 hover:scale-110">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-3">
                      <svg width="36" height="20" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.6">
                          <g>
                            <path d="M26.5512 3.26459C25.4693 2.64402 24.5922 3.1524 24.5922 4.39919V13.5999C24.5922 14.848 25.4693 15.3557 26.5512 14.7357L34.5931 10.1237C35.6753 9.50293 35.6753 8.49715 34.5931 7.8765L26.5512 3.26459Z" 
                              className="fill-violet-500" />
                          </g>
                          <g>
                            <path d="M9.44883 3.26459C10.5307 2.64402 11.4078 3.1524 11.4078 4.39919V13.5999C11.4078 14.848 10.5307 15.3557 9.44883 14.7357L1.40692 10.1237C0.324687 9.50293 0.324687 8.49715 1.40692 7.8765L9.44883 3.26459Z" 
                              className="fill-fuchsia-500" />
                          </g>
                          <rect x="17" width="2" height="20" rx="1" className="fill-violet-400" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-y-0 w-[1px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(to bottom, transparent, white, transparent)',
                    boxShadow: '0 0 15px rgba(255,255,255,0.5)'
                  }}
                />
              </div>
            )}

            {(!images.light?.url || !images.dark?.url) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300">
                <p className="rounded-xl bg-white/90 px-6 py-3 text-sm text-gray-600 shadow-lg ring-1 ring-violet-100">
                  {!images.light?.url && !images.dark?.url 
                    ? "Ajoutez des images pour voir la prévisualisation"
                    : !images.light?.url 
                      ? "Ajoutez une image pour le mode clair"
                      : "Ajoutez une image pour le mode sombre"
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const bothImagesLoaded = images.light?.url && images.dark?.url;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <div className="container mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
        <div className="space-y-8">
          {!bothImagesLoaded ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white/50 p-8 shadow-2xl backdrop-blur-sm ring-1 ring-white/50"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Téléchargeur d'Images Thématiques
                </h2>
                <p className="mt-3 text-gray-500">
                  Créez une expérience visuelle unique avec vos thèmes clair et sombre
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                <DropZone 
                  theme="light"
                  image={images.light}
                  icon={Sun}
                  onImageSelect={handleImageSelection}
                  onImageRemove={(theme) => {
                    setImages(prev => ({ ...prev, [theme]: null }));
                    setError(prev => ({ ...prev, [theme]: '' }));
                  }}
                  error={error.light}
                />
                <DropZone 
                  theme="dark"
                  image={images.dark}
                  icon={Moon}
                  onImageSelect={handleImageSelection}
                  onImageRemove={(theme) => {
                    setImages(prev => ({ ...prev, [theme]: null }));
                    setError(prev => ({ ...prev, [theme]: '' }));
                  }}
                  error={error.dark}
                />
              </div>
            </motion.div>
          ) : (
            <ThemePreview />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageThemeUploader;