import { useMenu } from '../../context/MenuContext';
import { Phone, MapPin, Clock, Globe } from 'lucide-react';

export function HeroHeader() {
  const { state } = useMenu();
  const { restaurantInfo } = state;

  return (
    <header className="relative">
      <div className="h-64 md:h-80 relative overflow-hidden bg-primary/20">
        {restaurantInfo.coverImageBase64 ? (
          <img
            src={restaurantInfo.coverImageBase64}
            alt="Restaurant cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="relative bg-surface shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-start gap-4">
            {restaurantInfo.logoBase64 && (
              <div className="flex-shrink-0 -mt-16 relative z-10">
                <img
                  src={restaurantInfo.logoBase64}
                  alt="Logo"
                  className="w-20 h-20 rounded-card object-cover border-4 border-surface shadow-md"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-main leading-tight">
                {restaurantInfo.name}
              </h1>
              {restaurantInfo.tagline && (
                <p className="mt-1 text-text-main/60 text-base">{restaurantInfo.tagline}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-text-main/60">
                {restaurantInfo.phone && (
                  <a href={`tel:${restaurantInfo.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Phone size={14} />
                    {restaurantInfo.phone}
                  </a>
                )}
                {restaurantInfo.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {restaurantInfo.address}
                  </span>
                )}
                {restaurantInfo.openingHours && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {restaurantInfo.openingHours}
                  </span>
                )}
                {restaurantInfo.website && (
                  <a
                    href={restaurantInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <Globe size={14} />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
