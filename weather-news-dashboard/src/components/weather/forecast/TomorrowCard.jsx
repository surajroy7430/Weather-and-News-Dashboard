import { getWeatherIconUrl } from "@/utils/helper";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Navigation2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TomorrowCard = ({ tomorrow }) => {
  if (!tomorrow) return null;

  const { day, temp, weather, humidity, wind } = tomorrow;

  const temperature = Math.round(temp || 0);
  const windSpeed = wind.speed || 0;
  const windDeg = wind.deg || 0;
  const displaySpeed =
    windSpeed < 1
      ? `${windSpeed.toFixed(1)} m/s`
      : `${Math.round(windSpeed * 3.6)} km/h`;

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 gap-2 p-4 group bg-gradient-to-br from-blue-500/20 to-purple-500/20">
      <CardHeader className="flex items-start justify-between p-0">
        <CardTitle className="space-y-2">
          <Badge
            vaiant="secondary"
            className="font-medium bg-purple-100/80 text-purple-700 border-purple-600/20 px-3 py-1.5 rounded-full"
          >
            Tomorrow
          </Badge>
          <h3 className="text-lg font-bold">{day}</h3>
        </CardTitle>

        <img
          src={getWeatherIconUrl(weather.icon)}
          alt={weather.description}
          className="h-16 w-16 drop-shadow-lg transition-all duration-700 group-hover:rotate-12"
        />
      </CardHeader>

      <CardContent className="space-y-3 p-0">
        <div>
          <div className="text-4xl font-bold tracking-tight mb-1">
            {temperature}°C
          </div>
          <p className="text-sm text-foreground/70 capitalize">
            {weather.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="px-0 justify-between text-xs text-muted-foreground border-t ">
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

export default TomorrowCard;
