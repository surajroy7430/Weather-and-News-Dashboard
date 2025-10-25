import { motion } from "motion/react";
import { useMemo, useEffect, useState } from "react";
import { getWeatherIconUrl, getWindDirection } from "@/utils/helper";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  RiHeartLine,
  RiHeartFill,
  RiCloudFill,
  RiWindyLine,
  RiWaterPercentLine,
} from "@remixicon/react";
import {
  Navigation2,
  ThermometerSun,
  ThermometerSnowflake,
} from "lucide-react";

const WeatherCard = ({ weatherData, favorites, city, addToFavorites }) => {
  if (!weatherData) return null;

  const { clouds, main, weather, wind, dt } = weatherData;

  const [showSpeed, setShowSpeed] = useState(true);
  const currentWeather = weather[0];
  const temperature = Math.round(main.temp || 0);
  const cloudsPercent = Math.round(clouds.all || 0);
  const feelsLike = Math.round(main.feels_like || 0);
  const minTemp = Math.round(main.temp_min || 0);
  const maxTemp = Math.round(main.temp_max || 0);
  const humidity = main.humidity || 0;
  const windDeg = Math.round(wind.deg || 0);
  const windSpeed = wind.speed || 0;
  const displaySpeed =
    windSpeed < 1
      ? `${windSpeed.toFixed(1)} m/s`
      : `${Math.round(windSpeed * 3.6)} km/h`;

  const localTime = new Date(dt * 1000);
  const day = localTime.toLocaleDateString("en-US", { weekday: "long" });
  const date = localTime.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = localTime
    .toLocaleDateString("en-US", {
      minute: "2-digit",
      hour: "2-digit",
      hour12: true,
    })
    .split(", ")[1];

  const isFavorited = useMemo(
    () => favorites?.some((fav) => fav.name === city),
    [favorites, city]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setShowSpeed((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-sm bg-card/30 border-border/30 gap-2 overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1.5">
              <CardTitle className="text-3xl">{day}</CardTitle>
              <CardDescription className="text-base">
                {date} <span className="text-sm">at {time}</span>
              </CardDescription>
            </div>
            <button
              className={`cursor-pointer self-start justify-self-start ${
                isFavorited
                  ? "text-red-600 pointer-events-none opacity-40"
                  : "text-red-500 hover:text-red-600"
              }`}
              onClick={addToFavorites}
              disabled={isFavorited}
            >
              {isFavorited ? (
                <RiHeartFill className="h-8 w-8" />
              ) : (
                <RiHeartLine className="h-8 w-8" />
              )}
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 z-10">
            <div className="">
              <div className="flex items-center gap-2">
                <p className="text-7xl font-bold tracking-tighter">
                  {temperature}°C
                </p>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Feels like {feelsLike}°
                  </p>

                  <div className="flex gap-2 text-sm font-medium">
                    <span className="flex items-center gap-1 text-sky-500">
                      <ThermometerSnowflake className="h-4 w-4" />
                      {minTemp}°
                    </span>
                    <span className="flex items-center gap-1 text-orange-600">
                      <ThermometerSun className="h-4 w-4" />
                      {maxTemp}°
                    </span>
                  </div>
                </div>
              </div>
              {cloudsPercent !== 0 && (
                <div className="flex items-center gap-1 font-medium text-muted-foreground/60">
                  <RiCloudFill className="h-5 w-5" />
                  <span>{cloudsPercent}% Clouds</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-muted/20 rounded-lg p-2 flex items-center gap-2"
                >
                  <RiWaterPercentLine className="w-6 h-6 text-blue-600" />
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">
                      Humidity
                    </p>
                    <p className="font-bold text-foreground/70">{humidity}%</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-muted/20 rounded-lg p-2 flex items-center gap-2"
                >
                  <RiWindyLine className="w-6 h-6 text-green-600" />
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">
                      Wind
                    </p>
                    <div className="relative h-6 overflow-hidden">
                      <motion.div
                        key={showSpeed ? "speed" : "direction"}
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center"
                      >
                        {showSpeed ? (
                          <span className="font-medium text-foreground/70">
                            {displaySpeed}
                          </span>
                        ) : (
                          <div className="font-bold text-foreground/70 flex items-center gap-0.5">
                            <Navigation2
                              className="h-3 w-3"
                              strokeWidth={3}
                              fill="#ccc"
                              style={{ transform: `rotate(${windDeg}deg)` }}
                            />
                            {getWindDirection(windDeg)}
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="flex items-center pointer-events-none">
              <div className="relative w-full h-[180px]">
                <img
                  src={getWeatherIconUrl(weather?.[0].icon)}
                  alt={weather?.[0].description}
                  className="w-full h-full object-contain drop-shadow-lg animate-pulse"
                />
                <p className="absolute bottom-0 md:top-0 w-full text-center capitalize text-lg font-medium text-muted-foreground">
                  {currentWeather?.description}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherCard;
