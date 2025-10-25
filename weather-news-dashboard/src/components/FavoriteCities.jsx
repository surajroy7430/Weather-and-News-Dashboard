import { toast } from "sonner";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getWeatherIconUrl } from "../utils/helper";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const FavoriteCities = ({ cities, onSelectCity, onRemove }) => {
  if (!cities || cities.length === 0) return null;

  return (
    <>
      <h1 className="text-xl font-bold tracking-tight mb-2">Favorites</h1>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 pb-4">
          {cities.map((city) => {
            const weatherIcon = getWeatherIconUrl(city.icon);

            return (
              <Card
                key={city._id}
                className="relative flex-shrink-0 w-72 cursor-pointer overflow-hidden transition-all group backdrop-blur-sm bg-card/50 border-border/30"
                onClick={() => {
                  onSelectCity(city.name);
                  toast.success(`Selected ${city.name}`, {
                    description: `${city.temp}°C - ${city.condition}`,
                  });
                }}
              >
                <div className="absolute top-1 right-1 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full p-0 hover:text-destructive backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(city._id);
                      toast.info(`Removed ${city.name} from favorites`);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <CardContent className="flex items-center gap-2">
                  <img
                    src={weatherIcon}
                    alt={city.condition}
                    className="h-10 w-10"
                  />
                  <div>
                    <p className="font-medium">
                      {city.name},{" "}
                      <span className="text-muted-foreground font-normal">
                        {city.country}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                      {parseFloat(city.lat).toFixed(2)}°N,{" "}
                      {parseFloat(city.lon).toFixed(2)}°E
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xl font-bold text-left">{city.temp}°</p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {city.condition}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="mt-2" />
      </ScrollArea>
    </>
  );
};

export default FavoriteCities;
