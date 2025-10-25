const axios = require("axios");
const logger = require("../utils/logger");
const { getCache, setCache } = require("../utils/cache");

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const OPENWEATHER_GEO = "https://api.openweathermap.org/geo/1.0";

const getCurrentWeather = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        status: "error",
        code: "MISSING_PARAMETERS",
        message: "Either city name or coordinates (lat, lon) are required",
      });
    }

    // Create cache key
    const cacheKey = city
      ? `weather:city:${city.toLowerCase()}`
      : `weather:coords:${lat},${lon}`;

    // Check cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json({
        status: "success",
        data: cachedData,
        cached: true,
      });
    }

    // ----------------------------------------------------
    // 1. Fetch current weather data
    // ----------------------------------------------------
    let weatherUrl = `${OPENWEATHER_BASE_URL}/weather?appid=${OPENWEATHER_API_KEY}&units=metric`;

    if (city) {
      weatherUrl += `&q=${encodeURIComponent(city)}`;
    } else {
      weatherUrl += `&lat=${lat}&lon=${lon}`;
    }

    const weatherRes = await axios.get(weatherUrl, {
      timeout: 5000,
    });

    const weatherData = weatherRes.data;

    const latitude = weatherData?.coord?.lat || lat;
    const longitude = weatherData?.coord?.lon || lon;

    // ----------------------------------------------------
    // 2. Fetch geolocation info (state, country)
    // ----------------------------------------------------
    let geoUrl;
    if (latitude && longitude) {
      geoUrl = `${OPENWEATHER_GEO}/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    } else if (city) {
      geoUrl = `${OPENWEATHER_GEO}/direct?q=${encodeURIComponent(
        city
      )}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    }

    let geoInfo = {};
    if (geoUrl) {
      const geoRes = await axios.get(geoUrl);

      if (geoRes.data.length > 0) {
        const loc = geoRes.data[0];
        geoInfo = {
          name: loc.name,
          state: loc.state || null,
          country: loc.country,
          fullName: loc.state ? `${loc.name}, ${loc.state}` : loc.name,
          lat: loc.lat,
          lon: loc.lon,
        };
      }
    }

    // ----------------------------------------------------
    // 3. Fetch AQI
    // ----------------------------------------------------
    const aqiRes = await axios.get(
      `${OPENWEATHER_BASE_URL}/air_pollution?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`
    );

    const airData = aqiRes.data?.list?.[0];

    const aqi = airData?.main?.aqi ?? null;
    const pm2_5 = airData?.components?.pm2_5 ?? null;
    const pm10 = airData?.components?.pm10 ?? null;

    // ----------------------------------------------------
    // 4. Merge all data
    // ----------------------------------------------------
    const mergedData = {
      ...weatherData,
      fullName:
        geoInfo.fullName ||
        `${weatherData.name}, ${weatherData.sys?.country || ""}`.trim(),
      state: geoInfo.state || null,
      country: geoInfo.country || weatherData.sys?.country || null,
      coord: {
        lat: latitude,
        lon: longitude,
      },
      air_quality: {
        aqi,
        pm2_5,
        pm10,
      },
    };

    // Cache the response for 15 minutes
    await setCache(cacheKey, mergedData, 900);

    logger.info(`Weather data fetched for: ${city || `${lat},${lon}`}`);

    res.json({
      status: "success",
      data: mergedData,
      cached: false,
    });
  } catch (error) {
    next(error);
  }
};

const getWeatherForecast = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        status: "error",
        code: "MISSING_PARAMETERS",
        message: "Either city name or coordinates (lat, lon) are required",
      });
    }

    // Create cache key
    const cacheKey = city
      ? `forecast:city:${city.toLowerCase()}`
      : `forecast:coords:${lat},${lon}`;

    // Check cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json({
        status: "success",
        data: cachedData,
        cached: true,
      });
    }

    // Build API URL
    let apiUrl = `${OPENWEATHER_BASE_URL}/forecast?appid=${OPENWEATHER_API_KEY}&units=metric`;

    if (city) {
      apiUrl += `&q=${encodeURIComponent(city)}`;
    } else {
      apiUrl += `&lat=${lat}&lon=${lon}`;
    }

    // Fetch from OpenWeatherMap
    const response = await axios.get(apiUrl, {
      timeout: 5000,
    });

    const forecastData = response.data;

    // -------------------------
    // Hourly Forecast (24 hour)
    // -------------------------
    const hourlyForecasts = forecastData.list.slice(0, 8).map((item) => {
      const date = new Date(item.dt * 1000);
      const hours = date.getHours();

      const formattedHour = `${hours % 12 === 0 ? 12 : hours % 12} ${
        hours < 12 ? "AM" : "PM"
      }`;

      return {
        dt: item.dt,
        time: formattedHour,
        temp: Math.round(item.main.temp),
        weather: item.weather[0],
        humidity: item.main.humidity,
        wind: item.wind.speed,
        feels_like: Math.round(item.main.feels_like),
      };
    });

    // -----------------------
    // Daily Forecast (7 days)
    // -----------------------
    const dailyMap = new Map();

    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000);

      const day = date
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();

      dailyMap.set(day, {
        day,
        date: item.dt * 1000,
        temp: item.main.temp,
        weather: item.weather[0],
        humidity: item.main.humidity,
        wind: item.wind,
      });
    });

    const dailyForecasts = Array.from(dailyMap.values()).slice(1, 7);

    // Final data
    const processedData = {
      city: forecastData.city,
      hourly: hourlyForecasts,
      daily: dailyForecasts,
    };

    // Cache the response
    await setCache(cacheKey, processedData);

    logger.info(`Forecast data fetched for: ${city || `${lat},${lon}`}`);

    res.json({
      status: "success",
      data: processedData,
      cached: false,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCurrentWeather, getWeatherForecast };
