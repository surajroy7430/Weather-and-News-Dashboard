import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RiMapPinLine, RiCloudLine, RiNewspaperLine } from "@remixicon/react";
import { useState } from "react";

const TabNavigation = ({
  weatherData,
  cityData,
  weatherContent,
  newsContent,
}) => {
  if (!weatherData || !cityData) {
    return (
      <Card className="backdrop-blur-sm bg-card/30 border-border/30">
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Skeleton className="h-16 bg-accent-foreground/40 sm:w-3/4" />
            <Skeleton className="h-10 sm:h-16 bg-accent-foreground/40 w-1/2 sm:w-1/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const { name, state, country } = weatherData;
  const { population } = cityData;
  const [viewType, setViewType] = useState("weather");

  return (
    <>
      <div className="w-full space-y-6 mb-4">
        {/* Header */}
        <Card className="backdrop-blur-sm border bg-card/50 border-border/30 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <RiMapPinLine className="w-6 h-6 text-purple-600" />
                <div>
                  <CardTitle className="text-2xl font-bold flex flex-wrap items-baseline gap-1">
                    {name}
                    {state && state !== name && (
                      <span className="text-xl leading-none">{state},</span>
                    )}
                    <span className="text-xl text-muted-foreground">
                      {country}
                    </span>
                  </CardTitle>
                  <CardDescription className="pt-1">
                    Population: {population.toLocaleString()}
                  </CardDescription>
                </div>
              </div>

              <ToggleGroup
                type="single"
                value={viewType}
                onValueChange={(value) => value && setViewType(value)}
                className="rounded-lg p-1"
              >
                <ToggleGroupItem
                  value="weather"
                  className="data-[state=on]:bg-purple-500 data-[state=on]:text-white flex items-center space-x-2 rounded-md"
                >
                  <RiCloudLine className="w-4 h-4" />
                  <span>Weather</span>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="news"
                  className="data-[state=on]:bg-purple-500 data-[state=on]:text-white flex items-center space-x-2 rounded-md"
                >
                  <RiNewspaperLine className="w-4 h-4" />
                  <span>News</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Content */}
      {viewType === "weather" ? weatherContent : newsContent}
    </>
  );
};

export default TabNavigation;
