import { motion } from "motion/react";
import { RiTempColdLine } from "@remixicon/react";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TodayTemperature = ({ hourlyData }) => {
  if (!hourlyData || hourlyData.length === 0) return null

  const chartData = hourlyData.map((hour) => ({
    time: hour.time,
    temperature: Math.round(hour.temp),
    feelsLike: Math.round(hour.feels_like),
    humidity: hour.humidity,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const { temperature, feelsLike, humidity } = payload[0]?.payload || {};

      return (
        <div className="bg-background p-2 rounded-lg shadow-sm min-w-[8rem] text-xs grid items-start gap-1.5">
          <div className="flex items-center justify-between leading-none gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="shrink-0 h-2.5 w-2.5 rounded-xs bg-orange-500" />
              <span className="text-muted-foreground ">Temperature:</span>
            </div>

            <span className="text-foreground/80 font-medium">
              {temperature}°C
            </span>
          </div>
          <div className="flex items-center justify-between leading-none gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="shrink-0 h-2.5 w-2.5 rounded-xs bg-blue-500" />
              <span className="text-muted-foreground ">Feels like:</span>
            </div>

            <span className="text-foreground/80 font-medium">
              {feelsLike}°C
            </span>
          </div>
          <div className="flex items-center justify-between leading-none gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="shrink-0 h-2.5 w-2.5 rounded-xs bg-zinc-500" />
              <span className="text-muted-foreground ">Humidity:</span>
            </div>

            <span className="text-foreground/80 font-medium">{humidity}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="flex-1 backdrop-blur-sm bg-card/30 border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <RiTempColdLine className="w-5 h-5" />
            Today's Temperature
          </CardTitle>
        </CardHeader>

        <CardContent className="h-[200px]">
          <ChartContainer className="aspect-auto h-full w-full">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.4} />
                </linearGradient>

                <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.4} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="time"
                stroke="#888"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                unit="°C"
              />

              <ChartTooltip content={<CustomTooltip />} cursor={false} />
              {/* <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" /> */}

              <Line
                type="monotone"
                dataKey="feelsLike"
                stroke="url(#feelsGradient)"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ fill: "#3b82f6", r: 3 }}
                activeDot={{
                  r: 5,
                  fill: "#0ea5e9",
                  stroke: "#fff",
                  strokeWidth: 1.5,
                }}
                name="Feels Like"
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="url(#tempGradient)"
                strokeWidth={3}
                dot={{ fill: "#f97316", r: 4 }}
                activeDot={{
                  r: 7,
                  fill: "#ef4444",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                name="Temperature"
                connectNulls
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TodayTemperature;
