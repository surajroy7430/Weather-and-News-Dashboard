import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { RiListCheck2, RiLeafLine, RiEyeLine } from "@remixicon/react";
import { Sunrise, Sunset, Gauge } from "lucide-react";
import { getAqiLevel, getVisibilityInfo } from "@/utils/helper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WeatherDetails = ({ cityData }) => {
  if (!cityData) {
    return (
      <Card className="backdrop-blur-sm">
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 bg-accent-foreground/50 w-1/3" />
            <Skeleton className="h-8 bg-accent-foreground/50" />
            <Skeleton className="h-8 bg-accent-foreground/50" />
            <Skeleton className="h-8 bg-accent-foreground/50" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const { air_quality, main, sys, visibility } = cityData;

  const sunrise = sys.sunrise
    ? new Date(sys.sunrise * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "--";
  const sunset = sys.sunset
    ? new Date(sys.sunset * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "--";

  const aqiInfo = getAqiLevel(air_quality.aqi);
  const visibilityInfo = getVisibilityInfo(visibility);

  return (
    <Card className="backdrop-blur-sm bg-card/30 border-border/30 overflow-hidden gap-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <RiListCheck2 className="w-5 h-5" />
          Today's Highlight
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {/* Sunrise/Sunset */}
        <Card className="border-0 gap-3 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-orange-500/20 to-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-3 text-orange-900 dark:text-orange-100">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Sunrise className="text-orange-600 dark:text-orange-400 h-5 w-5" />
              </div>
              Sunrise & Sunset
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-white/60 dark:bg-black/20 p-3 sm:p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Sunrise className="text-orange-500 h-5 w-5" />
                  <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                    Sunrise
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-bold uppercase text-orange-600 dark:text-orange-400">
                  {sunrise}
                </span>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Sunset className="text-orange-700 dark:text-orange-500 h-5 w-5" />
                  <span className="text-sm sm:text-base font-medium  text-gray-700 dark:text-gray-300">
                    Sunset
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-bold uppercase text-orange-700 dark:text-orange-500">
                  {sunset}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Air Quality */}
        <Card className="border-0 gap-3 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-3 text-emerald-900 dark:text-emerald-100">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <RiLeafLine className="text-emerald-600 dark:text-emerald-400 h-5 w-5" />
              </div>
              Air Quality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge
                className={`${aqiInfo.color} rounded-full px-4 py-1 text-sm font-semibold`}
              >
                {aqiInfo.label}
              </Badge>
              <span className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200">
                {air_quality.aqi}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
              {aqiInfo.description}
            </p>
            <div className="space-y-2 bg-white/60 dark:bg-black/20 p-3 rounded-lg backdrop-blur-sm">
              <div className="flex justify-between text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">PM2.5:</span>
                <span className="font-semibold">
                  {air_quality.pm2_5.toFixed(1)} μg/m³
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">PM10:</span>
                <span className="font-semibold">
                  {air_quality.pm10.toFixed(1)} μg/m³
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visibility */}
        <Card className="border-0 gap-3 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-3 text-teal-900 dark:text-teal-100">
              <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-full">
                <RiEyeLine className="text-teal-600 dark:text-teal-400 h-5 w-5" />
              </div>
              Visibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center bg-white/60 dark:bg-black/20 p-4 sm:p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl sm:text-5xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {(visibility / 1000).toFixed(1)}
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                km
              </div>
            </div>
            <Progress
              value={(visibility / 10000) * 100}
              indicatorClassName="bg-teal-600"
            />
            <div className="text-center">
              <Badge
                className={`px-4 py-1 text-sm font-semibold rounded-full ${visibilityInfo.color}`}
              >
                {visibilityInfo.label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pressure */}
        <Card className="border-0 gap-3 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-3 text-purple-900 dark:text-purple-100">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Gauge className="text-purple-600 dark:text-purple-400 h-5 w-5" />
              </div>
              Pressure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center bg-white/60 dark:bg-black/20 p-4 sm:p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl sm:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {main.pressure}
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                hPa
              </div>
            </div>
            <Progress
              value={((main.pressure - 980) / (1040 - 980)) * 100}
              indicatorClassName="bg-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 font-medium">
              <span>Low</span>
              <span>Normal</span>
              <span>High</span>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default WeatherDetails;
