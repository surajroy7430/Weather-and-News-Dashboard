import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { getWeatherIconUrl } from "@/utils/helper";
import { Navigation2 } from "lucide-react";

const ForecastCard = ({ daily }) => {
  if (!daily) return null;

  const { day, temp, weather, humidity, wind } = daily;

  const temperature = Math.round(temp || 0);
  const windSpeed = wind.speed || 0;
  const windDeg = wind.deg || 0;
  const displaySpeed =
    windSpeed < 1
      ? `${windSpeed.toFixed(1)} m/s`
      : `${Math.round(windSpeed * 3.6)} km/h`;

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 gap-2 p-4 group bg-gradient-to-br from-muted-foreground/20 to-transparent">
      <CardHeader className="flex items-center justify-between p-0">
        <CardTitle className="text-sm text-foreground/90">{day}</CardTitle>

        <img
          src={getWeatherIconUrl(weather.icon)}
          alt={weather.description}
          className="h-14 w-14 drop-shadow-lg transition-all duration-700 group-hover:rotate-12"
        />
      </CardHeader>

      <CardContent className="space-y-3 p-0">
        <div>
          <div className="text-4xl font-bold tracking-tight">
            {temperature}°C
          </div>
          <p className="text-sm text-muted-foreground capitalize">
            {weather.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="px-0 justify-between text-xs text-muted-foreground border-t border-border/60">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-foreground/80">Humidity</span>
          <span>{humidity || 0}%</span>
        </div>
        <div className="flex flex-col gap-0.5 text-right">
          <span className="font-semibold text-foreground/80">Wind Speed</span>
          <span className="flex items-center justify-end gap-0.5">
            <Navigation2
              className="h-3 w-3"
              fill="#ccc"
              style={{ transform: `rotate(${windDeg}deg)` }}
            />
            {displaySpeed}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ForecastCard;
