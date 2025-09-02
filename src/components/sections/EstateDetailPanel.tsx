import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  Home, 
  Euro, 
  MapPin, 
  Square, 
  Image as ImageIcon,
  ExternalLink,
  Calendar,
  User
} from 'lucide-react';
import { type OnOfficeEstate } from '@/hooks/useOnOfficeAPI';

interface EstateDetailPanelProps {
  estate: OnOfficeEstate | null;
  estateImages: any[];
  isOpen: boolean;
  onClose: () => void;
}

export const EstateDetailPanel = ({ estate, estateImages, isOpen, onClose }: EstateDetailPanelProps) => {
  if (!estate) return null;

  const formatPrice = (price: string | undefined) => {
    if (!price) return 'Preis auf Anfrage';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  // Group images by type
  const imagesByType = estateImages.reduce((acc, image) => {
    const type = image.elements?.type || 'Sonstige';
    if (!acc[type]) acc[type] = [];
    acc[type].push(image);
    return acc;
  }, {});

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sliding Panel */}
      <div className={`
        fixed top-0 left-0 h-full w-96 bg-background border-r border-border/50 z-50
        transform transition-transform duration-300 ease-in-out shadow-medium
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-border/50 bg-primary/5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-primary">Immobilien Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">ID: {estate.elements.Id || estate.id}</p>
        </div>

        {/* Content */}
        <ScrollArea className="h-full pb-20">
          <div className="p-4 space-y-6">
            
            {/* Title and Basic Info */}
            <div>
              <h3 className="text-xl font-bold mb-2">
                {estate.elements.objekttitel || `Immobilie #${estate.elements.Id || estate.id}`}
              </h3>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{estate.elements.ort || 'Ort nicht angegeben'}</span>
                </div>
                <Badge variant="outline">
                  {estate.elements.vermarktungsart || 'Typ nicht angegeben'}
                </Badge>
              </div>

              <div className="text-2xl font-bold text-primary mb-4">
                {formatPrice(estate.elements.kaufpreis || estate.elements.kaltmiete)}
              </div>
            </div>

            <Separator />

            {/* Property Details */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Objektdaten</span>
              </h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                {estate.elements.wohnflaeche && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Wohnfläche:</span>
                    <span className="font-medium">{estate.elements.wohnflaeche} m²</span>
                  </div>
                )}
                {estate.elements.zimmer && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Zimmer:</span>
                    <span className="font-medium">{estate.elements.zimmer}</span>
                  </div>
                )}
                {estate.elements.schlafzimmer && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Schlafzimmer:</span>
                    <span className="font-medium">{estate.elements.schlafzimmer}</span>
                  </div>
                )}
                {estate.elements.badezimmer && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Badezimmer:</span>
                    <span className="font-medium">{estate.elements.badezimmer}</span>
                  </div>
                )}
                {estate.elements.etage && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Etage:</span>
                    <span className="font-medium">{estate.elements.etage}</span>
                  </div>
                )}
                {estate.elements.baujahr && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Baujahr:</span>
                    <span className="font-medium">{estate.elements.baujahr}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            {estate.elements.objektbeschreibung && (
              <div>
                <h4 className="font-semibold mb-3">Beschreibung</h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {estate.elements.objektbeschreibung}
                </p>
              </div>
            )}

            <Separator />

            {/* Images by Type */}
            {Object.keys(imagesByType).length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>Bilder ({estateImages.length})</span>
                </h4>
                
                {Object.entries(imagesByType).map(([type, images]: [string, any[]]) => (
                  <div key={type} className="mb-4">
                    <h5 className="text-sm font-medium mb-2 flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {type} ({images.length})
                      </Badge>
                    </h5>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {images.map((image, index) => (
                        <div key={image.id || index} className="relative group">
                          {image.elements?.imageUrl ? (
                            <div className="relative">
                              <img 
                                src={image.elements.imageUrl} 
                                alt={image.elements.title || `${type} ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-border/20 hover:scale-105 transition-transform cursor-pointer"
                                onClick={() => window.open(image.elements.imageUrl, '_blank')}
                              />
                              
                              {/* Position indicator */}
                              {image.elements.position && (
                                <div className="absolute top-1 right-1">
                                  <Badge variant="outline" className="text-xs px-1 py-0 bg-background/80">
                                    {image.elements.position}
                                  </Badge>
                                </div>
                              )}
                              
                              {/* Title on hover */}
                              {image.elements.title && (
                                <div className="absolute inset-0 bg-black/70 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end">
                                  <p className="truncate font-medium">{image.elements.title}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-full h-24 bg-muted rounded-lg border border-border/20 flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Actions */}
            <div className="pt-4">
              <Button variant="outline" className="w-full" asChild>
                <a href="https://login.onoffice.de" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  In onOffice öffnen
                </a>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};