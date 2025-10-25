import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import TomorrowCard from "./TomorrowCard";
import ForecastCard from "./ForecastCard";

const ForecastData = ({ dailyData, timeout }) => {
  if ((!dailyData || dailyData.length === 0) && !timeout) return null;
  if (timeout && (!dailyData || dailyData.length === 0)) return null;

  return (
    <Card className="backdrop-blur-sm bg-card/30 border-border/30 overflow-hidden gap-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <CalendarDays className="w-5 h-5" />
          5-Day Forecast
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4">
        {/* Tomorrow Card */}
        <TomorrowCard tomorrow={dailyData[0]} />

        {/* Other Days */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
          {dailyData.slice(1).map((daily, index) => (
            <ForecastCard key={`daily-${index}`} daily={daily} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastData;
