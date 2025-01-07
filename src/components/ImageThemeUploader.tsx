import React, { useState, useCallback, useRef } from 'react';
import { Sun, Moon, Upload, AlertCircle, Trash2, ImagePlus, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div
        className={cn(
          "group relative overflow-hidden rounded-lg transition-all duration-300",
          "border border-gray-200 dark:border-[#333333] bg-white dark:bg-[#000000]",
          error ? "ring-2 ring-red-500" : "hover:border-gray-300 dark:hover:border-[#444444]",
          "hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        )}
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

        <div className="min-h-[300px] p-6">
          {image ? (
            <div className="relative rounded-md overflow-hidden">
              <img
                src={image.url}
                alt={`${theme} theme`}
                className="w-full h-[240px] object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex items-center justify-center">
                <div className="flex gap-3 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-[#ffffff] hover:bg-[#f5f5f5] text-black"
                    onClick={() => inputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Change
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onImageRemove(theme)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center gap-6 group/btn"
            >
              <div className="relative">
                <div className="rounded-full bg-gradient-to-b from-[#333333] to-[#222222] p-6 transition-transform duration-300 group-hover/btn:scale-110">
                  <Icon className="h-8 w-8 text-[#888888]" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-[#888888] text-sm font-medium">
                  {theme === 'light' ? 'Light' : 'Dark'} Mode
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[#333333] text-xs text-[#666666]">
                  <ImagePlus className="h-3 w-3" />
                  Drag or click to add
                </div>
              </div>
            </button>
          )}
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
    e.preventDefault();
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
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-[#333333] bg-white dark:bg-[#000000] max-w-4xl mx-auto">
        <div className="border-b border-gray-200 dark:border-[#333333] px-4 py-3 flex items-center gap-3">
          <div className="p-1.5 rounded-full bg-gray-100 dark:bg-[#333333]">
            <ArrowRight className="h-4 w-4 text-gray-600 dark:text-[#888888]" />
          </div>
          <h2 className="text-base font-medium text-gray-900 dark:text-white">Preview</h2>
        </div>

        <div 
          ref={sliderRef}
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: '16/9' }}
        >
          {images.dark?.url && (
            <div className="absolute inset-0 transition-opacity duration-500">
              <img
                src={images.dark.url}
                alt="Dark theme"
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
                alt="Light theme"
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
              <div className="absolute inset-y-0 w-[2px] bg-white/20 group-hover:bg-white/40 transition-colors duration-300" />

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="h-10 w-10 rounded-full bg-[#ffffff] shadow-lg flex items-center justify-center"
                >
                  <div className="flex items-center gap-1.5">
                    <Sun className="h-3.5 w-3.5 text-[#000000]" />
                    <Moon className="h-3.5 w-3.5 text-[#666666]" />
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {(!images.light?.url || !images.dark?.url) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-black/80 backdrop-blur-sm">
              <p className="rounded-lg bg-white dark:bg-[#111111] px-4 py-2 text-sm text-gray-600 dark:text-[#888888] border border-gray-200 dark:border-[#333333]">
                {!images.light?.url && !images.dark?.url 
                  ? "Add images to see the preview"
                  : !images.light?.url 
                    ? "Add an image for light mode"
                    : "Add an image for dark mode"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const bothImagesLoaded = images.light?.url && images.dark?.url;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        <div className="text-center space-y-3">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Theme Image Switcher
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-[#888888] text-sm"
          >
            Create a unique visual experience with your custom themes
          </motion.p>
        </div>

        {!bothImagesLoaded ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
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
          </motion.div>
        ) : (
          <ThemePreview />
        )}
      </div>
    </div>
  );
};

export default ImageThemeUploader;