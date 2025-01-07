import React, { useState, useCallback, useRef } from 'react';
import { Sun, Moon, Upload, X, AlertCircle, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(theme, file);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={`relative rounded-lg border-2 border-dashed p-4 transition-colors
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}
          ${image ? 'bg-gray-50' : 'bg-white'}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onImageSelect(theme, file);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-2 py-4">
          {image ? (
            <>
              <img
                src={image.url}
                alt={`${theme} theme preview`}
                className="max-h-32 w-auto rounded object-contain"
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                >
                  Changer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onImageRemove(theme)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-32 w-full"
                    onClick={() => inputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon className="h-6 w-6" />
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        <span>Mode {theme === 'light' ? 'clair' : 'sombre'}</span>
                      </div>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cliquez ou déposez une image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
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
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Prévisualisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={sliderRef}
            className="relative w-full aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
          >
            {images.dark?.url && (
              <img
                src={images.dark.url}
                alt="Theme preview dark"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            
            {images.light?.url && (
              <img
                src={images.light.url}
                alt="Theme preview light"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                }}
              />
            )}

            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg"
              style={{ 
                left: `${sliderPosition}%`,
                transform: 'translateX(-50%)'
              }}
              onMouseDown={handleMouseDown}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-500" />
                  <Moon className="w-3 h-3 text-indigo-500" />
                </div>
              </div>
            </div>

            {(!images.light?.url || !images.dark?.url) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-gray-500">
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

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Téléchargeur d'Images Thématiques</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <DropZone 
            theme="light"
            image={images.light}
            icon={Sun}
            onImageSelect={handleImageSelection}
            onImageRemove={(theme) => {
              setImages(prev => ({ ...prev, [theme]: null }));
              setError(prev => ({ ...prev, [theme]: '' }));
              if (inputRefs[theme].current) {
                inputRefs[theme].current.value = '';
              }
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
              if (inputRefs[theme].current) {
                inputRefs[theme].current.value = '';
              }
            }}
            error={error.dark}
          />
        </CardContent>
      </Card>
      <ThemePreview />
    </div>
  );
};

export default ImageThemeUploader;